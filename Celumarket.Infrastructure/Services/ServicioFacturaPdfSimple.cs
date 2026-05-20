using System.Text;
using Celumarket.Application.Interfaces.Services;

namespace Celumarket.Infrastructure.Services
{
    public class ServicioFacturaPdfSimple : IServicioFacturaPdf
    {
        public byte[] GenerarPdfTexto(IEnumerable<string> lineas)
        {
            var contenido = new StringBuilder();
            contenido.AppendLine("BT");
            contenido.AppendLine("/F1 10 Tf");
            contenido.AppendLine("36 806 Td");
            contenido.AppendLine("13 TL");

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
                Encoding.ASCII.GetBytes("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj\n"),
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
