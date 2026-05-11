using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;

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

            static string Money(decimal value) => $"$ {value:N2}";
            static string Fit(string text, int len) => (text.Length <= len ? text : text[..(len - 1)] + " ").PadRight(len);

            var lineas = new List<string>
            {
                "==============================================================",
                "                    CELUMARKET S.A.",
                "                  FACTURA ELECTRONICA (MOCK)",
                "==============================================================",
                $"Factura Nro: {factura.NumeroFactura}",
                $"CAE: {factura.CAE}    Vto. CAE: {factura.VencimientoCAE?.ToString("dd/MM/yyyy") ?? "-"}",
                $"Fecha Emision: {factura.FechaEmision:dd/MM/yyyy HH:mm}",
                "--------------------------------------------------------------",
                $"Pedido: #{detalle.Id}      Estado: {detalle.Estado}",
                $"Cliente: {factura.NombreReceptor}",
                $"DNI: {factura.DniReceptor}",
                $"Metodo de pago: {detalle.MetodoPago}",
                $"Tipo de envio: {detalle.TipoEnvio}",
                $"Costo de envio: {(detalle.CostoEnvio == 0 ? "Gratis" : Money(detalle.CostoEnvio))}",
                "--------------------------------------------------------------",
                "ITEMS",
                "--------------------------------------------------------------",
                $"{Fit("Producto", 34)} {Fit("Color", 10)} {Fit("Cant", 6)} {Fit("Subtotal", 10)}",
                "--------------------------------------------------------------"
            };

            foreach (var item in detalle.Lineas)
            {
                var producto = Fit($"{item.Marca} {item.Modelo}", 34);
                var color = Fit(item.Color, 10);
                var cant = Fit(item.Cantidad.ToString(), 6);
                var subtotal = Fit(Money(item.Subtotal), 10);
                lineas.Add($"{producto} {color} {cant} {subtotal}");
            }

            lineas.Add("--------------------------------------------------------------");
            lineas.Add($"TOTAL: {Money(detalle.MontoTotal)}");
            lineas.Add(" ");
            lineas.Add("Documento mock para pruebas academicas.");
            lineas.Add("Celumarket - San Nicolas de los Arroyos, Buenos Aires.");
            lineas.Add("==============================================================");

            var pdfBytes = _servicioFacturaPdf.GenerarPdfTexto(lineas);
            var nombreArchivo = $"Factura-{factura.NumeroFactura.Replace("/", "-").Replace(" ", "")}.pdf";
            return (nombreArchivo, pdfBytes);
        }
    }
}
