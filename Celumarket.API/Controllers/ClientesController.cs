using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Celumarket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly IGestorCliente _gestorCliente;
        private readonly IClienteRepository _clienteRepo;

        public ClientesController(IGestorCliente gestorCliente, IClienteRepository clienteRepo)
        {
            _gestorCliente = gestorCliente;
            _clienteRepo = clienteRepo;
        }

        [AllowAnonymous]
        [HttpPost("registrar")]
        public async Task<IActionResult> RegistrarCliente([FromBody] ClienteDTOs.RegistrarClienteDTO dto)
        {
            int nuevoClienteId = await _gestorCliente.RegistrarClienteAsync(dto);
            return Ok(new { Mensaje = "Cliente registrado con éxito.", ClienteId = nuevoClienteId });
        }
        
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] ClienteDTOs.LoginDTO dto)
        {
            string token = await _gestorCliente.LoginAsync(dto);
            return Ok(new { Mensaje = "Login exitoso.", Token = token });
        }

        [Authorize(Roles = "Cliente")]
        [HttpGet("mi-perfil")]
        public async Task<IActionResult> ObtenerMiPerfil()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            int usuarioId = int.Parse(userIdClaim.Value);
            var cliente = await _clienteRepo.ObtenerPorUsuarioIdAsync(usuarioId);
            if (cliente == null) return NotFound(new { error = "Cliente no encontrado." });

            var perfil = await _gestorCliente.ObtenerPerfilAsync(cliente.Id);

            return Ok(perfil);
        }

        [Authorize(Roles = "Cliente")]
        [HttpPut("mi-perfil")]
        public async Task<IActionResult> ActualizarMiPerfil([FromBody] ClienteDTOs.ActualizarClienteDTO dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            int usuarioId = int.Parse(userIdClaim.Value);
            var cliente = await _clienteRepo.ObtenerPorUsuarioIdAsync(usuarioId);
            if (cliente == null) return NotFound(new { error = "Cliente no encontrado." });

            dto.ClienteId = cliente.Id;
            await _gestorCliente.ActualizarPerfilAsync(dto);

            return Ok(new { Mensaje = "Perfil actualizado con éxito." });
        }

        [Authorize(Roles = "Cliente")]
        [HttpPost("cambiar-clave")]
        public async Task<IActionResult> CambiarClave([FromBody] ClienteDTOs.CambiarClaveDTO dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            int usuarioId = int.Parse(userIdClaim.Value);

            await _gestorCliente.CambiarClaveAsync(usuarioId, dto);
            return Ok(new { Mensaje = "Clave actualizada con éxito." });
        }

        [AllowAnonymous]
        [HttpPost("recuperar-clave/solicitar")]
        public async Task<IActionResult> SolicitarRecuperacionClave([FromBody] ClienteDTOs.SolicitarRecuperacionClaveDTO dto)
        {
            await _gestorCliente.SolicitarRecuperacionClaveAsync(dto);
            return Ok(new { Mensaje = "Si el email existe, se envió un token de recuperación." });
        }

        [AllowAnonymous]
        [HttpPost("recuperar-clave/confirmar")]
        public async Task<IActionResult> ConfirmarRecuperacionClave([FromBody] ClienteDTOs.ConfirmarRecuperacionClaveDTO dto)
        {
            await _gestorCliente.ConfirmarRecuperacionClaveAsync(dto);
            return Ok(new { Mensaje = "Clave restablecida con éxito." });
        }

        [Authorize(Roles = "Admin,Ventas,Soporte")]
        [HttpGet("lista-completa")]
        public async Task<IActionResult> ObtenerTodos()
        {
            var lista = await _clienteRepo.ObtenerTodosAsync();
            return Ok(lista);
        }
    }
}
