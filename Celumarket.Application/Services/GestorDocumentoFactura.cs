using System.Text;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;

namespace Celumarket.Application.Services
{
    public class GestorDocumentoFactura : IGestorDocumentoFactura
    {
        private readonly IGestorConsultaPedido _gestorConsultaPedido;
        private readonly IFacturaRepository _facturaRepo;

        public GestorDocumentoFactura(IGestorConsultaPedido gestorConsultaPedido, IFacturaRepository facturaRepo)
        {
            _gestorConsultaPedido = gestorConsultaPedido;
            _facturaRepo = facturaRepo;
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

            var pdfBytes = SimplePdfBuilder.GenerarPdfTexto(lineas);
            var nombreArchivo = $"Factura-{factura.NumeroFactura.Replace("/", "-").Replace(" ", "")}.pdf";
            return (nombreArchivo, pdfBytes);
        }

        private static class SimplePdfBuilder
        {
            public static byte[] GenerarPdfTexto(IEnumerable<string> lineas)
            {
                var contenido = new StringBuilder();
                contenido.AppendLine("BT");
                contenido.AppendLine("/F1 11 Tf");
                contenido.AppendLine("50 800 Td");
                contenido.AppendLine("14 TL");

                bool primera = true;
                foreach (var linea in lineas)
                {
                    var texto = EscapePdfText(linea);
                    if (!primera)
                        contenido.AppendLine("T*");
                    contenido.AppendLine($"({texto}) Tj");
                    primera = false;
                }

                contenido.AppendLine("ET");
                var streamData = Encoding.ASCII.GetBytes(contenido.ToString());

                var objects = new List<byte[]>
                {
                    Encoding.ASCII.GetBytes("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"),
                    Encoding.ASCII.GetBytes("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"),
                    Encoding.ASCII.GetBytes("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n"),
                    Encoding.ASCII.GetBytes("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"),
                    BuildStreamObject(streamData)
                };

                using var ms = new MemoryStream();
                void WriteAscii(string s) => ms.Write(Encoding.ASCII.GetBytes(s));

                WriteAscii("%PDF-1.4\n");
                WriteAscii("%\u00e2\u00e3\u00cf\u00d3\n");

                var offsets = new List<long> { 0 };
                foreach (var obj in objects)
                {
                    offsets.Add(ms.Position);
                    ms.Write(obj);
                }

                long xrefPos = ms.Position;
                WriteAscii($"xref\n0 {objects.Count + 1}\n");
                WriteAscii("0000000000 65535 f \n");
                for (int i = 1; i <= objects.Count; i++)
                {
                    WriteAscii($"{offsets[i]:D10} 00000 n \n");
                }

                WriteAscii("trailer\n");
                WriteAscii($"<< /Size {objects.Count + 1} /Root 1 0 R >>\n");
                WriteAscii("startxref\n");
                WriteAscii($"{xrefPos}\n");
                WriteAscii("%%EOF");

                return ms.ToArray();
            }

            private static byte[] BuildStreamObject(byte[] streamData)
            {
                using var ms = new MemoryStream();
                var header = Encoding.ASCII.GetBytes($"5 0 obj\n<< /Length {streamData.Length} >>\nstream\n");
                var footer = Encoding.ASCII.GetBytes("endstream\nendobj\n");
                ms.Write(header);
                ms.Write(streamData);
                ms.WriteByte((byte)'\n');
                ms.Write(footer);
                return ms.ToArray();
            }

            private static string EscapePdfText(string value)
            {
                return value
                    .Replace("\\", "\\\\")
                    .Replace("(", "\\(")
                    .Replace(")", "\\)");
            }
        }
    }
}
