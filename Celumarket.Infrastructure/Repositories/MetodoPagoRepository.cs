using Celumarket.Application.Interfaces;
using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Infrastructure.Repositories
{
    public class MetodoPagoRepository : IMetodoPagoRepository
    {
        private readonly CelumarketContext _context;

        public MetodoPagoRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task<MetodoPago> ObtenerPorIdAsync(int id)
        {
            return await _context.MetodosPago.FindAsync(id);
        }
    }
}
