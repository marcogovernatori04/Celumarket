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
    [Authorize(Roles = "Cliente")]
    public class CarritoController : ControllerBase
    {
        private readonly IGestorCarrito _gestorCarrito;
        private readonly IClienteRepository _clienteRepo;

        public CarritoController(IGestorCarrito gestorCarrito, IClienteRepository clienteRepo)
        {
            _gestorCarrito = gestorCarrito;
            _clienteRepo = clienteRepo;
        }

        private async Task<int> ObtenerClienteId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) throw new Exception("Usuario no autenticado.");

            int usuarioId = int.Parse(userIdClaim);

            var cliente = await _clienteRepo.ObtenerPorUsuarioIdAsync(usuarioId);
            if (cliente == null) throw new Exception("Cliente no encontrado.");
            return cliente.Id;
        }


        [HttpGet]
        public async Task<IActionResult> VerCarrito()
        {
            int clienteId = await ObtenerClienteId();
            var carrito = await _gestorCarrito.ObtenerCarritoClienteAsync(clienteId);
            return Ok(carrito);
        }

        [HttpPost("item")]
        public async Task<IActionResult> AgregarAlCarrito([FromBody] CarritoDTOs.AgregarItemDTO dto)
        {
            int clienteId = await ObtenerClienteId();
            await _gestorCarrito.AgregarItemAsync(clienteId, dto);
            return Ok(new { Mensaje = "Item agregado al carrito." });
        }

        [HttpPut("item/{variacionId}/restar")]
        public async Task<IActionResult> RestarItemCarrito(int variacionId)
        {
            int clienteId = await ObtenerClienteId();
            await _gestorCarrito.RestarItemAsync(clienteId, variacionId, 1);
            return Ok(new { Mensaje = "Se restó una unidad del producto." });
        }

        [HttpDelete("item/{variacionId}")]
        public async Task<IActionResult> EliminarDelCarrito(int variacionId)
        {
            int clienteId = await ObtenerClienteId();
            await _gestorCarrito.EliminarItemAsync(clienteId, variacionId);
            return Ok(new { Mensaje = "Item eliminado del carrito." });
        }

        [HttpDelete("vaciar")]
        public async Task<IActionResult> VaciarCarrito()
        {
            int clienteId = await ObtenerClienteId(); 
            await _gestorCarrito.VaciarCarritoAsync(clienteId);
            return Ok(new { Mensaje = "Carrito vaciado exitosamente." });
        }
    }
}
