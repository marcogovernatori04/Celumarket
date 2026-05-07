using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Domain;
using Microsoft.EntityFrameworkCore;

namespace Celumarket.Infrastructure.Repositories
{
    public class ColorRepository : IColorRepository
    {
        private readonly CelumarketContext _context;

        public ColorRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task<List<Color>> ObtenerActivosAsync()
        {
            return await _context.Colores
                .Where(c => c.Activo)
                .OrderBy(c => c.Nombre)
                .ToListAsync();
        }

        public async Task<Color?> ObtenerPorIdAsync(int id)
        {
            return await _context.Colores.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Color?> ObtenerPorNombreAsync(string nombre)
        {
            return await _context.Colores
                .FirstOrDefaultAsync(c => c.Nombre.ToLower() == nombre.ToLower());
        }

        public async Task AgregarAsync(Color color)
        {
            await _context.Colores.AddAsync(color);
        }
    }
}
