using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;
using MercadoPago.Client.Preference;
using MercadoPago.Config;
using MercadoPago.Resource.Preference;
using Microsoft.Extensions.Configuration;

namespace Celumarket.Infrastructure.Services
{
    public class ServicioMercadoPago : IServicioMercadoPago
    {
        private readonly IConfiguration _config;

        public ServicioMercadoPago(IConfiguration config)
        {
            _config = config;
            MercadoPagoConfig.AccessToken = config["MercadoPago:AccessToken"];
        }

        public async Task<string> GenerarLinkDePagoAsync(Pedido pedido)
        {
            string frontendBaseUrl = _config["MercadoPago:FrontendBaseUrl"]?.TrimEnd('/')
                ?? throw new InvalidOperationException("MercadoPago:FrontendBaseUrl no está configurado.");

            string successUrl = _config["MercadoPago:SuccessUrl"]
                ?? $"{frontendBaseUrl}/?pago=exitoso";

            string failureUrl = _config["MercadoPago:FailureUrl"]
                ?? $"{frontendBaseUrl}/?pago=fallido";

            string pendingUrl = _config["MercadoPago:PendingUrl"]
                ?? $"{frontendBaseUrl}/?pago=pendiente";

            string notificationUrl = _config["MercadoPago:NotificationUrl"]
                ?? throw new InvalidOperationException("MercadoPago:NotificationUrl no está configurado.");

            var request = new PreferenceRequest
            {
                Items = new List<PreferenceItemRequest>
                {
                    new PreferenceItemRequest
                    {
                        Title = $"Compra en Celumarket - Pedido #{pedido.Id}",
                        Quantity = 1,
                        CurrencyId = "ARS",
                        UnitPrice = pedido.MontoTotal
                    }
                },
                ExternalReference = pedido.Id.ToString(),
                BackUrls = new PreferenceBackUrlsRequest
                {
                    Success = successUrl,
                    Failure = failureUrl,
                    Pending = pendingUrl
                },
                NotificationUrl = notificationUrl,
                AutoReturn = "all"
            };

            var client = new PreferenceClient();
            Preference preference = await client.CreateAsync(request);

            return preference.InitPoint; 
        }
    }
}
