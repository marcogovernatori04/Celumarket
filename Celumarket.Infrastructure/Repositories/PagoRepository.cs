using Celumarket.Application.Interfaces;
using Celumarket.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Infrastructure.Repositories
{
    public class PagoRepository : IPagoRepository
    {
        private readonly CelumarketContext _context;

        public PagoRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task AgregarAsync(Pago pago)
        {
            await _context.Pagos.AddAsync(pago);
        }

        public async Task<Pago> ObtenerPorPedidoIdAsync(int pedidoId)
        {
            return await _context.Pagos
                .Where(p => p.PedidoId == pedidoId && p.Estado == "Pendiente")
                .FirstOrDefaultAsync();
        }   

        public async Task GuardarAsync()
        {
            await _context.SaveChangesAsync();
        }

    }
}
