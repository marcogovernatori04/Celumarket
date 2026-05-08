using Celumarket.Domain;

namespace Celumarket.Application.Interfaces.Repositories
{
    public interface IReservaCheckoutRepository
    {
        Task AgregarAsync(ReservaCheckout reserva);
        Task<ReservaCheckout?> ObtenerActivaPorClienteIdAsync(int clienteId);
        Task<ReservaCheckout?> ObtenerPorIdAsync(int reservaId);
        Task<List<ReservaCheckout>> ObtenerActivasVencidasAsync(DateTime fechaUtcActual);
    }
}
