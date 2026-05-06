using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Domain;
using Microsoft.EntityFrameworkCore;

namespace Celumarket.Infrastructure.Repositories
{
    public class FacturaRepository : IFacturaRepository
    {
        private readonly CelumarketContext _context;

        public FacturaRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task AgregarAsync(Factura factura)
        {
            await _context.Facturas.AddAsync(factura);
        }

        public async Task<Factura?> ObtenerPorPedidoIdAsync(int pedidoId)
        {
            return await _context.Facturas.FirstOrDefaultAsync(f => f.PedidoId == pedidoId);
        }

        public async Task GuardarAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
