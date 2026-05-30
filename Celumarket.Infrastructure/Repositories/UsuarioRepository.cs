using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Domain;
using Microsoft.EntityFrameworkCore;

namespace Celumarket.Infrastructure.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly CelumarketContext _context;

        public UsuarioRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task<Usuario> ObtenerPorEmailAsync(string email)
        {
            return await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<Usuario> ObtenerPorIdAsync(int id)
        {
            return await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<IEnumerable<ClienteDTOs.UsuarioInternoListadoDTO>> ObtenerInternosAsync()
        {
            return await _context.Usuarios
                .Where(u => u.Rol.Nombre != "Cliente")
                .Select(u => new ClienteDTOs.UsuarioInternoListadoDTO
                {
                    Id = u.Id,
                    Email = u.Email,
                    Rol = u.Rol.Nombre
                })
                .OrderBy(u => u.Rol)
                .ThenBy(u => u.Email)
                .ToListAsync();
        }

        public async Task AgregarAsync(Usuario usuario)
        {
            await _context.Usuarios.AddAsync(usuario);
        }

        public async Task GuardarAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
