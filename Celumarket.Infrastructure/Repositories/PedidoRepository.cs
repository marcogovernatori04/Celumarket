using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Domain;
using Microsoft.EntityFrameworkCore;
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
            return await _context.Pedidos
                .Include(p => p.Lineas)
                    .ThenInclude(l => l.VariacionCelular)
                        .ThenInclude(v => v.Celular)
                .Include(p => p.Lineas)
                    .ThenInclude(l => l.VariacionCelular)
                        .ThenInclude(v => v.Color)
                .Include(p => p.Lineas)
                    .ThenInclude(l => l.VariacionCelular)
                        .ThenInclude(v => v.Imagenes)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<Pedido>> ObtenerTodosAsync()
        {
            return await _context.Pedidos
                .Include(p => p.Lineas)
                .ToListAsync();
        }

        public async Task<List<Pedido>> ObtenerPedidosPorClienteAsync(int clienteId)
        {
            return await _context.Pedidos
                .Where(p => p.ClienteId == clienteId)
                .Include(p => p.Lineas)
                .ToListAsync();
        }

        public async Task<List<Pedido>> ObtenerPendientesVencidosAsync(DateTime fechaUtcActual)
        {
            return await _context.Pedidos
                .Where(p => p.Estado == Pedido.EstadoPendienteDePago && p.FechaVencimiento < fechaUtcActual)
                .Include(p => p.Lineas)
                .ToListAsync();
        }

        public async Task GuardarAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
