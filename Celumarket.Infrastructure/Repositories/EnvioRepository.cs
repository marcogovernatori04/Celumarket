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
    public class EnvioRepository : IEnvioRepository
    {
        private readonly CelumarketContext _context;

        public EnvioRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task AgregarAsync(Envio envio)
        {
            await _context.Envios.AddAsync(envio);
        }

        public async Task<Envio> ObtenerPorIdAsync(int id)
        {
            return await _context.Envios.FindAsync(id);
        }

        public async Task<Envio?> ObtenerPorPedidoIdAsync(int pedidoId)
        {
            return await _context.Envios.FirstOrDefaultAsync(e => e.PedidoId == pedidoId);
        }

        public async Task<List<Envio>> ObtenerTodosAsync()
        {
            return await _context.Envios
                .OrderByDescending(e => e.FechaEstimada)
                .ToListAsync();
        }

        public async Task GuardarAsync()
        {
            await _context.SaveChangesAsync();
        }

    }
}
