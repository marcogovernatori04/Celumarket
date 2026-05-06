using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Celumarket.Application.DTOs.ClienteDTOs;

namespace Celumarket.Application.Interfaces.Repositories
{
    public interface IClienteRepository
    {
        Task AgregarAsync(Cliente cliente);
        Task<Cliente> ObtenerPorDniAsync(string dni);
        Task<Cliente> ObtenerPorIdAsync(int id);
        Task<Cliente?> ObtenerPorUsuarioIdAsync(int usuarioId);
        Task<IEnumerable<ClienteListadoDTO>> ObtenerTodosAsync();
        Task GuardarAsync();
    }
}
