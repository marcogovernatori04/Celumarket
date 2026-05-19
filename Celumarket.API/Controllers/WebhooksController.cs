using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces.Services;
using MercadoPago.Client.Payment;
using MercadoPago.Config;
using MercadoPago.Resource.Payment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;
using System.Text;

namespace Celumarket.API.Controllers
{
    public class WebhookPayload
    {
        public string? action { get; set; }
        public string? type { get; set; }
        public WebhookData? data { get; set; }
    }

    public class WebhookData
    {
        public string? id { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class WebhooksController : ControllerBase
    {
        private static readonly TimeSpan MaxWebhookClockSkew = TimeSpan.FromMinutes(5);
        private readonly IGestorPago _gestorPago;
        private readonly IConfiguration _config;
        private readonly IHostEnvironment _hostEnvironment;
        private readonly ILogger<WebhooksController> _logger;

        public WebhooksController(
            IGestorPago gestorPago,
            IConfiguration config,
            IHostEnvironment hostEnvironment,
            ILogger<WebhooksController> logger)
        {
            _gestorPago = gestorPago;
            _config = config;
            _hostEnvironment = hostEnvironment;
            _logger = logger;
            MercadoPagoConfig.AccessToken = _config["MercadoPago:AccessToken"];
        }

        [HttpPost("mercadopago")]
        public async Task<IActionResult> RecibirNotificacionMP([FromBody] WebhookPayload payload)
        {
            try
            {
                if (!TryValidateWebhookSignature(out var validationError))
                {
                    if (_hostEnvironment.IsProduction())
                    {
                        _logger.LogWarning("Webhook de Mercado Pago rechazado: {Reason}", validationError);
                        return Unauthorized(new { error = validationError });
                    }

                    _logger.LogWarning(
                        "Webhook de Mercado Pago con firma inválida en entorno no productivo. Se continúa procesamiento. Razón: {Reason}",
                        validationError);
                }

                if (payload == null || !EsNotificacionDePago(payload))
                    return Ok();

                string? paymentId = payload.data?.id ?? Request.Query["data.id"].FirstOrDefault();
                if (!long.TryParse(paymentId, out long pagoId))
                {
                    _logger.LogWarning("Webhook de Mercado Pago recibido sin payment id válido.");
                    return BadRequest(new { error = "El webhook no contiene un payment id válido." });
                }

                var client = new PaymentClient();
                Payment pago = await client.GetAsync(pagoId);
                _logger.LogInformation(
                    "Webhook MP recibido. paymentId={PaymentId}, status={Status}, externalReference={ExternalReference}",
                    pago.Id,
                    pago.Status,
                    pago.ExternalReference);

                if (string.Equals(pago.Status, "approved", StringComparison.OrdinalIgnoreCase)
                    && int.TryParse(pago.ExternalReference, out int pedidoId))
                {
                    var montoTotalFinal = pago.TransactionDetails?.TotalPaidAmount;
                    var valorCuota = (pago.Installments.HasValue && pago.Installments.Value > 1 && montoTotalFinal.HasValue)
                        ? Math.Round(montoTotalFinal.Value / pago.Installments.Value, 2)
                        : montoTotalFinal;

                    await _gestorPago.ProcesarRespuestaPasarelaAsync(new PagoDTOs.RespuestaPasarelaDTO
                    {
                        PedidoId = pedidoId,
                        PagoAprobado = true,
                        DatosMercadoPago = new PagoDTOs.DatosMercadoPagoDTO
                        {
                            PaymentIdExterno = pago.Id?.ToString(),
                            MetodoPagoId = pago.PaymentMethodId,
                            TipoPagoId = pago.PaymentTypeId,
                            Cuotas = pago.Installments ?? 0,
                            ValorCuota = valorCuota,
                            MontoTotalFinal = montoTotalFinal,
                            MontoPagado = pago.TransactionAmount,
                            MontoNetoRecibido = pago.TransactionDetails?.NetReceivedAmount,
                            FechaAprobacionUtc = pago.DateApproved?.ToUniversalTime()
                        }
                    });
                    _logger.LogInformation("Pago MP aprobado procesado para pedidoId={PedidoId}.", pedidoId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error procesando webhook de Mercado Pago.");
            }

            return Ok();
        }

        private bool EsNotificacionDePago(WebhookPayload payload)
        {
            return string.Equals(payload.type, "payment", StringComparison.OrdinalIgnoreCase)
                || (payload.action != null
                    && payload.action.StartsWith("payment", StringComparison.OrdinalIgnoreCase));
        }

        private bool TryValidateWebhookSignature(out string error)
        {
            error = string.Empty;

            string? webhookSecret = _config["MercadoPago:WebhookSecret"];
            if (string.IsNullOrWhiteSpace(webhookSecret))
            {
                error = "La secret del webhook de Mercado Pago no está configurada.";
                return false;
            }

            string? xSignature = Request.Headers["x-signature"].FirstOrDefault();
            string? xRequestId = Request.Headers["x-request-id"].FirstOrDefault();
            string? dataId = Request.Query["data.id"].FirstOrDefault();

            if (string.IsNullOrWhiteSpace(xSignature)
                || string.IsNullOrWhiteSpace(xRequestId)
                || string.IsNullOrWhiteSpace(dataId))
            {
                error = "Faltan headers o query params requeridos para validar la firma del webhook.";
                return false;
            }

            if (!TryParseSignatureHeader(xSignature, out string? ts, out string? receivedSignature))
            {
                error = "El header x-signature tiene un formato inválido.";
                return false;
            }

            if (!TryParseTimestamp(ts!, out DateTimeOffset signatureTimestamp))
            {
                error = "El timestamp del webhook no es válido.";
                return false;
            }

            if (DateTimeOffset.UtcNow - signatureTimestamp > MaxWebhookClockSkew)
            {
                error = "El webhook expiró o llegó fuera de la ventana permitida.";
                return false;
            }

            string manifest = $"id:{dataId.ToLowerInvariant()};request-id:{xRequestId};ts:{ts};";
            string expectedSignature = ComputeHmacSha256(webhookSecret, manifest);

            if (!FixedTimeEquals(expectedSignature, receivedSignature!))
            {
                error = "La firma del webhook no coincide.";
                return false;
            }

            return true;
        }

        private static bool TryParseSignatureHeader(string xSignature, out string? ts, out string? v1)
        {
            ts = null;
            v1 = null;

            foreach (var part in xSignature.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
            {
                var keyValue = part.Split('=', 2, StringSplitOptions.TrimEntries);
                if (keyValue.Length != 2)
                    continue;

                if (keyValue[0] == "ts")
                    ts = keyValue[1];
                else if (keyValue[0] == "v1")
                    v1 = keyValue[1];
            }

            return !string.IsNullOrWhiteSpace(ts) && !string.IsNullOrWhiteSpace(v1);
        }

        private static bool TryParseTimestamp(string ts, out DateTimeOffset timestamp)
        {
            timestamp = default;

            if (!long.TryParse(ts, out long numericTs))
                return false;

            timestamp = ts.Length > 10
                ? DateTimeOffset.FromUnixTimeMilliseconds(numericTs)
                : DateTimeOffset.FromUnixTimeSeconds(numericTs);

            return true;
        }

        private static string ComputeHmacSha256(string secret, string manifest)
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
            byte[] hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(manifest));
            return Convert.ToHexString(hashBytes).ToLowerInvariant();
        }

        private static bool FixedTimeEquals(string left, string right)
        {
            byte[] leftBytes = Encoding.UTF8.GetBytes(left);
            byte[] rightBytes = Encoding.UTF8.GetBytes(right);
            return CryptographicOperations.FixedTimeEquals(leftBytes, rightBytes);
        }
    }
}
