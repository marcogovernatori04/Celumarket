using Celumarket.Application.DTOs;

namespace Celumarket.Application.Interfaces.Services
{
    public interface IGestorConsultaPedido
    {
        Task<PedidoDTOs.DetallePedidoClienteDTO?> ObtenerDetallePedidoClienteAsync(int clienteId, int pedidoId);
    }
}
