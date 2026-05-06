using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Celumarket.API.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PedidosController : ControllerBase
    {
        private readonly IGestorPedido _gestorPedido;
        private readonly IGestorPago _gestorPago;
        private readonly IGestorCarrito _gestorCarrito;
        private readonly IServicioMercadoPago _servicioMP;
        private readonly IPedidoRepository _pedidoRepo;
        private readonly IMetodoPagoRepository _metodoPagoRepo;
        private readonly IClienteRepository _clienteRepo;

        public PedidosController(
            IGestorPedido gestorPedido, IGestorPago gestorPago, IGestorCarrito gestorCarrito, IServicioMercadoPago servicioMP,
            IPedidoRepository pedidoRepo, IMetodoPagoRepository metodoPagoRepo, IClienteRepository clienteRepo)
        {
            _gestorPedido = gestorPedido; _gestorPago = gestorPago; _gestorCarrito = gestorCarrito; _servicioMP = servicioMP;
            _pedidoRepo = pedidoRepo; _metodoPagoRepo = metodoPagoRepo; _clienteRepo = clienteRepo;
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

        [Authorize(Roles = "Cliente")]
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] PedidoDTOs.CheckoutDTO request)
        {
            var metodo = await _metodoPagoRepo.ObtenerPorIdAsync(request.MetodoPagoId);
            if (metodo == null)
                return BadRequest(new { error = "Método de pago no válido." });

            int clienteId = await ObtenerClienteId();
            var carrito = await _gestorCarrito.ObtenerCarritoClienteAsync(clienteId);

            if (carrito.Items.Count == 0)
                return BadRequest(new { error = "El carrito está vacío." });

            int pedidoId = await _gestorPedido.GenerarPedidoAsync(clienteId, request.MetodoPagoId, request.TipoEnvio, carrito.Items);
            await _gestorCarrito.VaciarCarritoAsync(clienteId);

            var pedidoCompleto = await _pedidoRepo.ObtenerPorIdAsync(pedidoId);
            await _gestorPago.GenerarPagoPendienteAsync(new PagoDTOs.GenerarPagoPendienteDTO
            {
                PedidoId = pedidoId,
                MetodoPagoId = request.MetodoPagoId,
                MontoTotal = pedidoCompleto.MontoTotal
            });

            string linkMP = null;

            if (metodo.Nombre.ToLower().Contains("mercado pago"))
            {
                linkMP = await _servicioMP.GenerarLinkDePagoAsync(pedidoCompleto);
            }

            return Ok(new { PedidoId = pedidoId, LinkMP = linkMP, Mensaje = "Pedido generado exitosamente." });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{pedidoId}/pagar")]
        public async Task<IActionResult> ConfirmarPago(int pedidoId)
        {
            await _gestorPago.RegistrarPagoManualAsync(new PagoDTOs.RegistrarPagoManualDTO
            {
                PedidoId = pedidoId
            });
            return Ok(new { Mensaje = "Pago confirmado exitosamente." });
        }

        [Authorize(Roles = "Cliente")]
        [HttpGet("mis-pedidos")]
        public async Task<IActionResult> VerMisPedidos()
        {
            int clienteId = await ObtenerClienteId();
            var pedidos = await _pedidoRepo.ObtenerPedidosPorClienteAsync(clienteId);
            return Ok(pedidos);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("todos")]
        public async Task<IActionResult> VerTodosLosPedidos()
        {
            var pedidos = await _pedidoRepo.ObtenerTodosAsync();
            return Ok(pedidos);
        }
    }
}
