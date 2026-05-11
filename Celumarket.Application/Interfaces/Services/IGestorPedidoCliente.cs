using Celumarket.Application.DTOs;
using Celumarket.Domain;

namespace Celumarket.Application.Interfaces.Services
{
    public interface IGestorPedidoCliente
    {
        Task<IEnumerable<(int Id, string Nombre, int MinutosPlazo)>> ObtenerMetodosPagoAsync();
        Task<PedidoDTOs.ReservaCheckoutDTO> IniciarCompraAsync(int clienteId);
        Task<(int PedidoId, string? LinkMP, DateTime FechaVencimientoUtc, string Mensaje)> CheckoutAsync(int clienteId, PedidoDTOs.CheckoutDTO request);
        Task<List<Pedido>> ObtenerMisPedidosAsync(int clienteId);
    }
}
