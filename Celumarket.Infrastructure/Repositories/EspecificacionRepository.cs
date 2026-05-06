using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Infrastructure.Repositories
{
    public class EspecificacionRepository : IEspecificacionRepository
    {
        private readonly CelumarketContext _context;

        public EspecificacionRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task AgregarRangoAsync(IEnumerable<Especificacion> especificaciones)
        {
            await _context.Especificaciones.AddRangeAsync(especificaciones);
        }

        public async Task<Especificacion> ObtenerPorIdAsync(int id)
        {
            return await _context.Especificaciones.FindAsync(id);
        }
    }
}
