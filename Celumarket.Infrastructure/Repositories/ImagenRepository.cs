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
    public class ImagenRepository : IImagenRepository
    {
        private readonly CelumarketContext _context;

        public ImagenRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task AgregarAsync(ImagenVariacion imagen)
        {
            await _context.ImagenesVariacion.AddAsync(imagen);
        }

        public async Task<IEnumerable<ImagenVariacion>> ObtenerPorVariacionIdAsync(int variacionId)
        {
            return await _context.ImagenesVariacion
                .Where(i => i.VariacionCelularId == variacionId)
                .ToListAsync();
        }

        public async Task ActualizarAsync(ImagenVariacion imagen)
        {
            _context.ImagenesVariacion.Update(imagen);
            await Task.CompletedTask;
        }

    }
}
