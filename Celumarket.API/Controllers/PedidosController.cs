using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Linq;

namespace Celumarket.API.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PedidosController : ControllerBase
    {
        private readonly IGestorPago _gestorPago;
        private readonly IPedidoRepository _pedidoRepo;
        private readonly IClienteRepository _clienteRepo;
        private readonly IGestorConsultaPedido _gestorConsultaPedido;
        private readonly IGestorDocumentoFactura _gestorDocumentoFactura;
        private readonly IGestorPedidoCliente _gestorPedidoCliente;

        public PedidosController(
            IGestorPago gestorPago,
            IPedidoRepository pedidoRepo, IClienteRepository clienteRepo, IGestorConsultaPedido gestorConsultaPedido, IGestorDocumentoFactura gestorDocumentoFactura, IGestorPedidoCliente gestorPedidoCliente)
        {
            _gestorPago = gestorPago;
            _pedidoRepo = pedidoRepo; _clienteRepo = clienteRepo;
            _gestorConsultaPedido = gestorConsultaPedido;
            _gestorDocumentoFactura = gestorDocumentoFactura;
            _gestorPedidoCliente = gestorPedidoCliente;
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
        [HttpGet("metodos-pago")]
        public async Task<IActionResult> ObtenerMetodosPago()
        {
            var metodos = await _gestorPedidoCliente.ObtenerMetodosPagoAsync();
            return Ok(metodos.Select(m => new { m.Id, m.Nombre, m.MinutosPlazo }));
        }

        [Authorize(Roles = "Cliente")]
        [HttpPost("iniciar-compra")]
        public async Task<IActionResult> IniciarCompra()
        {
            int clienteId = await ObtenerClienteId();
            var reserva = await _gestorPedidoCliente.IniciarCompraAsync(clienteId);
            return Ok(reserva);
        }

        [Authorize(Roles = "Cliente")]
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] PedidoDTOs.CheckoutDTO request)
        {
            int clienteId = await ObtenerClienteId();
            var resultado = await _gestorPedidoCliente.CheckoutAsync(clienteId, request);

            return Ok(new
            {
                resultado.PedidoId,
                resultado.LinkMP,
                FechaVencimientoUtc = resultado.FechaVencimientoUtc,
                resultado.Mensaje
            });
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
            var pedidos = await _gestorPedidoCliente.ObtenerMisPedidosAsync(clienteId);
            return Ok(pedidos);
        }

        [Authorize(Roles = "Cliente")]
        [HttpGet("mis-pedidos/{pedidoId}/detalle")]
        public async Task<IActionResult> VerDetalleMiPedido(int pedidoId)
        {
            int clienteId = await ObtenerClienteId();
            var detalle = await _gestorConsultaPedido.ObtenerDetallePedidoClienteAsync(clienteId, pedidoId);
            if (detalle == null)
                return NotFound(new { error = "Pedido no encontrado." });
            return Ok(detalle);
        }

        [Authorize(Roles = "Cliente")]
        [HttpGet("mis-pedidos/{pedidoId}/factura")]
        public async Task<IActionResult> DescargarFacturaMiPedido(int pedidoId)
        {
            int clienteId = await ObtenerClienteId();
            var (nombreArchivo, contenido) = await _gestorDocumentoFactura.GenerarFacturaPdfClienteAsync(clienteId, pedidoId);
            return File(contenido, "application/pdf", nombreArchivo);
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
