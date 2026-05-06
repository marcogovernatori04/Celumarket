using Celumarket.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Infrastructure.Services
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly CelumarketContext _context;

        public UnitOfWork(CelumarketContext context)
        {
            _context = context;
        }

        public async Task<int> GuardarAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
