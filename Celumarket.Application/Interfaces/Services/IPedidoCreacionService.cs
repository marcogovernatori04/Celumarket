using Celumarket.Application.DTOs;
using Celumarket.Domain;

namespace Celumarket.Application.Interfaces.Services
{
    public interface IGestorCreacionPedido
    {
        Task<int> GenerarPedidoAsync(int clienteId, int metodoPagoId, TipoEnvio tipoEnvio, List<CarritoDTOs.ItemCarritoDTO> items);
    }
}
