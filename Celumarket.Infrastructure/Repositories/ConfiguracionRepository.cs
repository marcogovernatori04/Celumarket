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
    public class ConfiguracionRepository : IConfiguracionRepository
    {
        private readonly CelumarketContext _context;

        public ConfiguracionRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task<ConfiguracionSistema> ObtenerConfigActualAsync()
        {
            return await _context.ConfiguracionesSistema.FirstOrDefaultAsync();
        }

    }
}
