namespace Celumarket.Application.Interfaces.Services
{
    public interface IGestorPagoPedido
    {
        Task ConfirmarPagoAsync(int pedidoId);
    }
}
