using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Linq;
using Celumarket.Domain;

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
        private readonly IPagoRepository _pagoRepo;
        private readonly IMetodoPagoRepository _metodoPagoRepo;
        private readonly IGestorPedido _gestorPedido;
        private readonly IGestorConsultaPedido _gestorConsultaPedido;
        private readonly IGestorDocumentoFactura _gestorDocumentoFactura;
        private readonly IGestorPedidoCliente _gestorPedidoCliente;

        public PedidosController(
            IGestorPago gestorPago,
            IPedidoRepository pedidoRepo, IClienteRepository clienteRepo, IPagoRepository pagoRepo, IMetodoPagoRepository metodoPagoRepo, IGestorPedido gestorPedido, IGestorConsultaPedido gestorConsultaPedido, IGestorDocumentoFactura gestorDocumentoFactura, IGestorPedidoCliente gestorPedidoCliente)
        {
            _gestorPago = gestorPago;
            _pedidoRepo = pedidoRepo; _clienteRepo = clienteRepo;
            _pagoRepo = pagoRepo;
            _metodoPagoRepo = metodoPagoRepo;
            _gestorPedido = gestorPedido;
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
            var pedido = await _pedidoRepo.ObtenerPorIdAsync(pedidoId);
            if (pedido == null)
                return NotFound(new { error = "Pedido no encontrado." });

            if (pedido.EstadoPedido != EstadoPedido.PendienteDePago)
                return BadRequest(new { error = "Solo se puede marcar como pagado un pedido pendiente." });

            if (pedido.EstaVencido())
                return BadRequest(new { error = "El pedido está vencido y no puede marcarse como pagado manualmente." });

            var pagoPendiente = await _pagoRepo.ObtenerPorPedidoIdAsync(pedidoId);
            if (pagoPendiente == null)
                return BadRequest(new { error = "No existe un pago pendiente para este pedido." });

            var metodo = await _metodoPagoRepo.ObtenerPorIdAsync(pagoPendiente.MetodoPagoId);
            if (metodo == null || !metodo.Nombre.Contains("transferencia", StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { error = "Solo se pueden marcar manualmente como pagados los pedidos con método transferencia." });

            await _gestorPago.RegistrarPagoManualAsync(new PagoDTOs.RegistrarPagoManualDTO
            {
                PedidoId = pedidoId
            });
            return Ok(new { Mensaje = "Pago confirmado exitosamente." });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{pedidoId}/cancelar")]
        public async Task<IActionResult> CancelarPedido(int pedidoId)
        {
            await _gestorPedido.CancelarPedidoAsync(pedidoId);
            return Ok(new { Mensaje = "Pedido cancelado exitosamente." });
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
            var resultado = new List<object>();
            foreach (var pedido in pedidos)
            {
                var cliente = await _clienteRepo.ObtenerPorIdAsync(pedido.ClienteId);
                resultado.Add(new
                {
                    pedido.Id,
                    pedido.ClienteId,
                    ClienteNombre = cliente == null ? "—" : $"{cliente.Nombre} {cliente.Apellido}".Trim(),
                    pedido.Fecha,
                    pedido.Estado,
                    pedido.TipoEnvio,
                    pedido.MontoTotal
                });
            }

            return Ok(resultado);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{pedidoId}/detalle-admin")]
        public async Task<IActionResult> VerDetallePedidoAdmin(int pedidoId)
        {
            var pedido = await _pedidoRepo.ObtenerPorIdAsync(pedidoId);
            if (pedido == null)
                return NotFound(new { error = "Pedido no encontrado." });

            var pago = await _pagoRepo.ObtenerUltimoPorPedidoIdAsync(pedidoId);
            string? metodoPago = null;
            if (pago != null)
            {
                var metodo = await _metodoPagoRepo.ObtenerPorIdAsync(pago.MetodoPagoId);
                metodoPago = metodo?.Nombre;
            }

            return Ok(new
            {
                pedido.Id,
                pedido.ClienteId,
                pedido.Estado,
                pedido.Fecha,
                pedido.FechaVencimiento,
                pedido.TipoEnvio,
                pedido.MontoTotal,
                pedido.CostoEnvio,
                MetodoPago = metodoPago,
                EstadoPago = pago?.Estado,
                Lineas = pedido.Lineas.Select(l => new
                {
                    l.Id,
                    Marca = l.VariacionCelular?.Celular?.Marca,
                    Modelo = l.VariacionCelular?.Celular?.Modelo,
                    Color = l.VariacionCelular?.Color?.Nombre,
                    l.Cantidad,
                    l.PrecioUnitario,
                    Subtotal = l.Cantidad * l.PrecioUnitario
                }).ToList()
            });
        }
    }
}
