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
    public class CelularRepository : ICelularRepository
    {
        private readonly CelumarketContext _context;

        public CelularRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task AgregarAsync(Celular celular)
        {
            await _context.Celulares.AddAsync(celular);
        }

        public async Task<Celular> ObtenerPorIdAsync(int id)
        {
            return await _context.Celulares.FindAsync(id);
        }

        public async Task<(IEnumerable<Celular> celulares, int total)> ObtenerTodosAsync(int pagina, int cantPorPagina)
        {
            var total = await _context.Celulares.CountAsync();

            var celulares = await _context.Celulares
                .Include(c => c.Variaciones)
                    .ThenInclude(v => v.Color)
                .Include(c => c.Variaciones)
                    .ThenInclude(v => v.Imagenes)
                .Skip((pagina - 1) * cantPorPagina)
                .Take(cantPorPagina)
                .ToListAsync();

            return (celulares, total);
        }

        public async Task<Celular> ObtenerDetalleAsync(int id)
        {
            return await _context.Celulares
                .Include(c => c.Variaciones)
                    .ThenInclude(v => v.Color)
                .Include(c => c.Variaciones)
                    .ThenInclude(v => v.Imagenes)
                .Include(c => c.Especificaciones)
                .FirstOrDefaultAsync(c => c.Id == id);
                
        }

        public async Task<List<Celular>> ObtenerDestacadosAsync(int cantidad)
        {
            return await _context.Celulares
                .Include(c => c.Variaciones)
                    .ThenInclude(v => v.Color)
                .Include(c => c.Variaciones)
                    .ThenInclude(v => v.Imagenes)
                .Where(c => c.EsDestacado)
                .Take(cantidad)
                .ToListAsync();
        }

        public void Eliminar(Celular celular)
        {
            _context.Celulares.Remove(celular);
        }

        public async Task GuardarAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
