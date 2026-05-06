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
    public class CarritoRepository : ICarritoRepository
    {
        private readonly CelumarketContext _context;

        public CarritoRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task<Carrito> ObtenerPorClienteIdAsync(int clienteId)
        {
            return await _context.Carritos
                .Include(c => c.Items)
                    .ThenInclude(i => i.VariacionCelular)
                        .ThenInclude(v => v.Celular)
                .Include(c => c.Items)
                    .ThenInclude(i => i.VariacionCelular)
                        .ThenInclude(v => v.Imagenes)
                .FirstOrDefaultAsync(c => c.ClienteId == clienteId);
        }

        public async Task AgregarAsync(Carrito carrito)
        {
            await _context.Carritos.AddAsync(carrito);
        }

        public async Task GuardarAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
