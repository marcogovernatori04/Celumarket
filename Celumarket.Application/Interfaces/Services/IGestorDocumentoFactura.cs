namespace Celumarket.Application.Interfaces.Services
{
    public interface IGestorDocumentoFactura
    {
        Task<(string NombreArchivo, byte[] Contenido)> GenerarFacturaPdfClienteAsync(int clienteId, int pedidoId);
    }
}
