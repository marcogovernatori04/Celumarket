namespace Celumarket.Application.Interfaces.Services
{
    public interface IGestorCancelacionPedido
    {
        Task CancelarPedidoAsync(int pedidoId);
    }
}
