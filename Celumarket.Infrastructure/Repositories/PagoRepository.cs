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
                .Where(p => p.PedidoId == pedidoId && p.Estado == Pago.EstadoPendiente)
                .OrderByDescending(p => p.Fecha)
                .FirstOrDefaultAsync();
        }

        public async Task<Pago?> ObtenerUltimoPorPedidoIdAsync(int pedidoId)
        {
            return await _context.Pagos
                .Where(p => p.PedidoId == pedidoId)
                .OrderByDescending(p => p.Estado == Pago.EstadoAprobado && p.DatosMercadoPago != null)
                .ThenByDescending(p => p.Fecha)
                .FirstOrDefaultAsync();
        }

        public async Task<List<Pago>> ObtenerAprobadosPorPedidoIdAsync(int pedidoId)
        {
            return await _context.Pagos
                .Where(p => p.PedidoId == pedidoId && p.Estado == Pago.EstadoAprobado && p.DatosMercadoPago != null)
                .OrderBy(p => p.Fecha)
                .ToListAsync();
        }

        public async Task<decimal> ObtenerTotalAprobadoPorPedidoIdAsync(int pedidoId)
        {
            return await _context.Pagos
                .Where(p => p.PedidoId == pedidoId && p.Estado == Pago.EstadoAprobado)
                .Select(p => (decimal?)p.Monto)
                .SumAsync() ?? 0m;
        }

        public async Task<bool> ExistePagoMercadoPagoPorExternoAsync(int pedidoId, string paymentIdExterno)
        {
            return await _context.Pagos
                .AnyAsync(p =>
                    p.PedidoId == pedidoId &&
                    p.DatosMercadoPago != null &&
                    p.DatosMercadoPago.PaymentIdExterno == paymentIdExterno);
        }

        public async Task GuardarAsync()
        {
            await _context.SaveChangesAsync();
        }

    }
}
