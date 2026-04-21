using Celumarket.Application.Interfaces;
using Celumarket.Domain;
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

        public async void Eliminar(Celular celular)
        {
            _context.Celulares.Remove(celular);
        }

        public async Task GuardarAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
