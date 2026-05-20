using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using System.Globalization;
using System.Text;

namespace Celumarket.Application.Services
{
    public class GestorDocumentoFactura : IGestorDocumentoFactura
    {
        private readonly IGestorConsultaPedido _gestorConsultaPedido;
        private readonly IFacturaRepository _facturaRepo;
        private readonly IServicioFacturaPdf _servicioFacturaPdf;

        public GestorDocumentoFactura(IGestorConsultaPedido gestorConsultaPedido, IFacturaRepository facturaRepo, IServicioFacturaPdf servicioFacturaPdf)
        {
            _gestorConsultaPedido = gestorConsultaPedido;
            _facturaRepo = facturaRepo;
            _servicioFacturaPdf = servicioFacturaPdf;
        }

        public async Task<(string NombreArchivo, byte[] Contenido)> GenerarFacturaPdfClienteAsync(int clienteId, int pedidoId)
        {
            var detalle = await _gestorConsultaPedido.ObtenerDetallePedidoClienteAsync(clienteId, pedidoId);
            if (detalle == null)
                throw new InvalidOperationException("Pedido no encontrado.");

            var factura = await _facturaRepo.ObtenerPorPedidoIdAsync(pedidoId);
            if (factura == null)
                throw new InvalidOperationException("Este pedido todavía no tiene factura emitida.");

            static string Money(decimal value) => $"$ {value.ToString("N2", CultureInfo.GetCultureInfo("es-AR"))}";
            static string FitLeft(string text, int len) => (text.Length <= len ? text : text[..(len - 3)] + "...").PadRight(len);
            static string FitRight(string text, int len) => (text.Length <= len ? text : text[^len..]).PadLeft(len);
            static string ToAscii(string text)
            {
                if (string.IsNullOrWhiteSpace(text)) return string.Empty;
                var normalized = text.Normalize(NormalizationForm.FormD);
                var sb = new StringBuilder(normalized.Length);
                foreach (var ch in normalized)
                {
                    var cat = CharUnicodeInfo.GetUnicodeCategory(ch);
                    if (cat != UnicodeCategory.NonSpacingMark)
                        sb.Append(ch);
                }
                return sb.ToString().Normalize(NormalizationForm.FormC);
            }

            const int anchoTotal = 92;
            var separador = new string('=', anchoTotal);
            var separadorSoft = new string('-', anchoTotal);

            var subtotalProductos = detalle.Lineas.Sum(x => x.Subtotal);
            var envio = detalle.CostoEnvio;
            var descuentoTransferencia = Math.Max(0m, (subtotalProductos + envio) - detalle.MontoTotal);

            var lineas = new List<string>
            {
                separador,
                "CELUMARKET S.A.".PadLeft((anchoTotal + "CELUMARKET S.A.".Length) / 2),
                "FACTURA ELECTRONICA (MOCK)".PadLeft((anchoTotal + "FACTURA ELECTRONICA (MOCK)".Length) / 2),
                separador,
                $"Factura Nro: {ToAscii(factura.NumeroFactura)}",
                $"CAE: {ToAscii(factura.CAE)}    Vto. CAE: {factura.VencimientoCAE?.ToString("dd/MM/yyyy") ?? "-"}",
                $"Fecha Emision: {factura.FechaEmision:dd/MM/yyyy HH:mm}",
                separadorSoft,
                $"Pedido: #{detalle.Id}    Estado: {ToAscii(detalle.Estado)}",
                $"Cliente: {ToAscii(factura.NombreReceptor)}",
                $"DNI: {ToAscii(factura.DniReceptor)}",
                $"Metodo de pago: {ToAscii(detalle.MetodoPago)}",
                $"Tipo de envio: {ToAscii(detalle.TipoEnvio)}",
                $"Costo de envio: {(detalle.CostoEnvio == 0 ? "Gratis" : Money(detalle.CostoEnvio))}",
                separadorSoft,
                "ITEMS",
                separadorSoft,
                $"{FitLeft("Producto", 46)} {FitLeft("Color", 14)} {FitRight("Cant", 6)} {FitRight("Subtotal", 20)}",
                separadorSoft
            };

            foreach (var item in detalle.Lineas)
            {
                var producto = FitLeft(ToAscii($"{item.Marca} {item.Modelo}"), 46);
                var color = FitLeft(ToAscii(item.Color), 14);
                var cant = FitRight(item.Cantidad.ToString(), 6);
                var subtotal = FitRight(Money(item.Subtotal), 20);
                lineas.Add($"{producto} {color} {cant} {subtotal}");
            }

            lineas.Add(separadorSoft);
            lineas.Add($"{FitLeft("Subtotal productos", 68)} {FitRight(Money(subtotalProductos), 20)}");
            lineas.Add($"{FitLeft("Envio", 68)} {FitRight(detalle.CostoEnvio == 0 ? "Gratis" : Money(envio), 20)}");
            if (descuentoTransferencia > 0)
                lineas.Add($"{FitLeft("Descuento transferencia", 68)} {FitRight($"- {Money(descuentoTransferencia)}", 20)}");
            lineas.Add(separadorSoft);
            lineas.Add($"{FitLeft("TOTAL", 68)} {FitRight(Money(detalle.MontoTotal), 20)}");
            lineas.Add(" ");
            lineas.Add("Documento mock para pruebas academicas.");
            lineas.Add("Celumarket - San Nicolas de los Arroyos, Buenos Aires.");
            lineas.Add(separador);

            var pdfBytes = _servicioFacturaPdf.GenerarPdfTexto(lineas);
            var nombreArchivo = $"Factura-{factura.NumeroFactura.Replace("/", "-").Replace(" ", "")}.pdf";
            return (nombreArchivo, pdfBytes);
        }
    }
}
