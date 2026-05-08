using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Domain;
using Microsoft.EntityFrameworkCore;

namespace Celumarket.Infrastructure.Repositories
{
    public class ReservaCheckoutRepository : IReservaCheckoutRepository
    {
        private readonly CelumarketContext _context;

        public ReservaCheckoutRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task AgregarAsync(ReservaCheckout reserva)
        {
            await _context.Set<ReservaCheckout>().AddAsync(reserva);
        }

        public async Task<ReservaCheckout?> ObtenerActivaPorClienteIdAsync(int clienteId)
        {
            return await _context.Set<ReservaCheckout>()
                .Include(r => r.Items)
                .FirstOrDefaultAsync(r => r.ClienteId == clienteId && r.Estado == EstadoReservaCheckout.Activa);
        }

        public async Task<ReservaCheckout?> ObtenerPorIdAsync(int reservaId)
        {
            return await _context.Set<ReservaCheckout>()
                .Include(r => r.Items)
                .FirstOrDefaultAsync(r => r.Id == reservaId);
        }

        public async Task<List<ReservaCheckout>> ObtenerActivasVencidasAsync(DateTime fechaUtcActual)
        {
            return await _context.Set<ReservaCheckout>()
                .Include(r => r.Items)
                .Where(r => r.Estado == EstadoReservaCheckout.Activa && r.FechaVencimientoUtc < fechaUtcActual)
                .ToListAsync();
        }
    }
}
