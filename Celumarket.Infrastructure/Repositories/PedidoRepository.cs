using Celumarket.Application.Interfaces;
using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Infrastructure.Repositories
{
    public class PedidoRepository : IPedidoRepository
    {
        private readonly CelumarketContext _context;

        public PedidoRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task AgregarAsync(Pedido pedido)
        {
            await _context.Pedidos.AddAsync(pedido);
        }

        public async Task<Pedido> ObtenerPorIdAsync(int id)
        {
            return await _context.Pedidos.FindAsync(id);
        }

        public async Task GuardarAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
