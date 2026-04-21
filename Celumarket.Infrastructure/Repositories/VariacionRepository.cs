using Celumarket.Application.Interfaces;
using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Infrastructure.Repositories
{
    public class VariacionRepository : IVariacionRepository
    {
        private readonly CelumarketContext _context;

        public VariacionRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task<VariacionCelular> ObtenerPorIdAsync(int id)
        {
            return await _context.Variaciones.FindAsync(id);
        }

        public async Task GuardarAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
