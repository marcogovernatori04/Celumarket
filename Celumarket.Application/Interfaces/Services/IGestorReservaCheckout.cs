using Celumarket.Application.DTOs;

namespace Celumarket.Application.Interfaces.Services
{
    public interface IGestorReservaCheckout
    {
        Task<PedidoDTOs.ReservaCheckoutDTO> IniciarReservaAsync(int clienteId, List<CarritoDTOs.ItemCarritoDTO> items);
        Task ExpirarReservasVencidasAsync(DateTime ahoraUtc, CancellationToken cancellationToken);
    }
}
