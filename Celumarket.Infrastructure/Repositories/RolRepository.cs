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
    public class RolRepository : IRolRepository
    {
        private readonly CelumarketContext _context;

        public RolRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task<Rol> ObtenerPorNombreAsync(string nombre)
        {
            return await _context.Roles.FirstOrDefaultAsync(r => r.Nombre == nombre);
        }
    }
}
