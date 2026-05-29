using Celumarket.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Celumarket.Application.DTOs.ClienteDTOs;

namespace Celumarket.Application.Interfaces.Services
{
    public interface IGestorCliente
    {
        Task<int> RegistrarClienteAsync(ClienteDTOs.RegistrarClienteDTO dto);
        Task<string> LoginAsync(ClienteDTOs.LoginDTO dto);
        Task ActualizarPerfilAsync(ClienteDTOs.ActualizarClienteDTO dto);
        Task<ClienteDTOs.ClienteDetalleDTO> ObtenerPerfilAsync(int clienteId);
        Task CambiarClaveAsync(int usuarioId, ClienteDTOs.CambiarClaveDTO dto);
        Task SolicitarRecuperacionClaveAsync(ClienteDTOs.SolicitarRecuperacionClaveDTO dto);
        Task ConfirmarRecuperacionClaveAsync(ClienteDTOs.ConfirmarRecuperacionClaveDTO dto);
    }
}
