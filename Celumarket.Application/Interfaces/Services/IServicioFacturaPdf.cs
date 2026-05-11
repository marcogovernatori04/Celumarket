namespace Celumarket.Application.Interfaces.Services
{
    public interface IServicioFacturaPdf
    {
        byte[] GenerarPdfTexto(IEnumerable<string> lineas);
    }
}
