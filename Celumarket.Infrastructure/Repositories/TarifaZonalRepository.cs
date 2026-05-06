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
    public class TarifaZonalRepository : ITarifaZonalRepository
    {
        private readonly CelumarketContext _context;

        public TarifaZonalRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task<TarifaZonal> ObtenerTarifaPorCPAsync(int codigoPostal)
        {
            return await _context.TarifasZonales.FirstOrDefaultAsync(t => t.CodigoPostal == codigoPostal);
        }
    }
}
