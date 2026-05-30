using Celumarket.Application.DTOs;
using Celumarket.Domain;

namespace Celumarket.Application.Interfaces.Repositories
{
    public interface IUsuarioRepository
    {
        Task<Usuario> ObtenerPorEmailAsync(string email);
        Task<Usuario> ObtenerPorIdAsync(int id);
        Task<IEnumerable<ClienteDTOs.UsuarioInternoListadoDTO>> ObtenerInternosAsync();
        Task AgregarAsync(Usuario usuario);
        Task GuardarAsync();
    }
}
