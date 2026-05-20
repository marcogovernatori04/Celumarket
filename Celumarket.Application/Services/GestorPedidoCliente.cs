using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;

namespace Celumarket.Application.Services
{
    public class GestorPedidoCliente : IGestorPedidoCliente
    {
        private readonly IMetodoPagoRepository _metodoPagoRepo;
        private readonly IGestorCarrito _gestorCarrito;
        private readonly IGestorReservaCheckout _gestorReservaCheckout;
        private readonly IReservaCheckoutRepository _reservaRepo;
        private readonly IGestorPedido _gestorPedido;
        private readonly IPedidoRepository _pedidoRepo;
        private readonly IGestorPago _gestorPago;
        private readonly IServicioMercadoPago _servicioMP;

        public GestorPedidoCliente(
            IMetodoPagoRepository metodoPagoRepo,
            IGestorCarrito gestorCarrito,
            IGestorReservaCheckout gestorReservaCheckout,
            IReservaCheckoutRepository reservaRepo,
            IGestorPedido gestorPedido,
            IPedidoRepository pedidoRepo,
            IGestorPago gestorPago,
            IServicioMercadoPago servicioMP)
        {
            _metodoPagoRepo = metodoPagoRepo;
            _gestorCarrito = gestorCarrito;
            _gestorReservaCheckout = gestorReservaCheckout;
            _reservaRepo = reservaRepo;
            _gestorPedido = gestorPedido;
            _pedidoRepo = pedidoRepo;
            _gestorPago = gestorPago;
            _servicioMP = servicioMP;
        }

        public async Task<IEnumerable<(int Id, string Nombre, int MinutosPlazo)>> ObtenerMetodosPagoAsync()
        {
            var metodos = await _metodoPagoRepo.ObtenerTodosAsync();
            return metodos.Select(m => (m.Id, m.Nombre, m.MinutosPlazo));
        }

        public async Task<PedidoDTOs.ReservaCheckoutDTO> IniciarCompraAsync(int clienteId)
        {
            var carrito = await _gestorCarrito.ObtenerCarritoClienteAsync(clienteId);
            if (carrito.Items.Count == 0)
                throw new InvalidOperationException("El carrito está vacío.");

            return await _gestorReservaCheckout.IniciarReservaAsync(clienteId, carrito.Items);
        }

        public async Task<(int PedidoId, string? LinkMP, DateTime FechaVencimientoUtc, string Mensaje)> CheckoutAsync(int clienteId, PedidoDTOs.CheckoutDTO request)
        {
            var metodo = await _metodoPagoRepo.ObtenerPorIdAsync(request.MetodoPagoId);
            if (metodo == null)
                throw new ArgumentException("Método de pago no válido.");

            var reservaActiva = await _reservaRepo.ObtenerActivaPorClienteIdAsync(clienteId);
            if (reservaActiva == null)
                throw new InvalidOperationException("No hay una reserva activa. Iniciá la compra nuevamente.");
            if (!reservaActiva.EstaActiva())
                throw new InvalidOperationException("La reserva expiró. Iniciá la compra nuevamente.");

            var itemsDesdeReserva = reservaActiva.Items
                .Select(i => new CarritoDTOs.ItemCarritoDTO
                {
                    VariacionId = i.VariacionId,
                    Cantidad = i.Cantidad
                })
                .ToList();

            Direccion? direccionEntrega = null;
            if (request.DireccionEntrega != null)
            {
                direccionEntrega = new Direccion(
                    request.DireccionEntrega.Calle,
                    request.DireccionEntrega.Numero,
                    request.DireccionEntrega.PisoDepto ?? string.Empty,
                    request.DireccionEntrega.Localidad,
                    request.DireccionEntrega.Provincia,
                    request.DireccionEntrega.CodigoPostal);
            }

            int pedidoId = await _gestorPedido.GenerarPedidoAsync(
                clienteId,
                request.MetodoPagoId,
                request.TipoEnvio,
                itemsDesdeReserva,
                direccionEntrega,
                stockYaBloqueado: true);

            reservaActiva.MarcarConsumida();
            await _gestorCarrito.VaciarCarritoAsync(clienteId);

            var pedidoCompleto = await _pedidoRepo.ObtenerPorIdAsync(pedidoId);
            string? linkMP = null;
            var esMercadoPago = metodo.Nombre.Contains("mercado pago", StringComparison.OrdinalIgnoreCase);
            if (esMercadoPago)
            {
                linkMP = await _servicioMP.GenerarLinkDePagoAsync(pedidoCompleto);
            }
            else
            {
                await _gestorPago.GenerarPagoPendienteAsync(new PagoDTOs.GenerarPagoPendienteDTO
                {
                    PedidoId = pedidoId,
                    MetodoPagoId = request.MetodoPagoId,
                    MontoTotal = pedidoCompleto.MontoTotal
                });
            }

            return (pedidoId, linkMP, pedidoCompleto.FechaVencimiento, "Pedido generado exitosamente.");
        }

        public async Task<List<Pedido>> ObtenerMisPedidosAsync(int clienteId)
        {
            return await _pedidoRepo.ObtenerPedidosPorClienteAsync(clienteId);
        }
    }
}
