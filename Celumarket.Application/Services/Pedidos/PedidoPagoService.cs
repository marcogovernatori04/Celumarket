using Celumarket.Application.Interfaces;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;

namespace Celumarket.Application.Services.Pedidos
{
    public class GestorPagoPedido : IGestorPagoPedido
    {
        private readonly IPedidoRepository _pedidoRepo;
        private readonly IVariacionRepository _variacionRepo;
        private readonly IClienteRepository _clienteRepo;
        private readonly IFacturaRepository _facturaRepo;
        private readonly IEnvioRepository _envioRepo;
        private readonly IGestorFacturacion _gestorFacturacion;
        private readonly IGestorEnvio _gestorEnvio;
        private readonly IServicioEmail _servicioEmail;
        private readonly IUnitOfWork _unitOfWork;

        public GestorPagoPedido(IPedidoRepository pedidoRepo, IVariacionRepository variacionRepo, IClienteRepository clienteRepo, IFacturaRepository facturaRepo, IEnvioRepository envioRepo, IGestorFacturacion gestorFacturacion, IGestorEnvio gestorEnvio, IServicioEmail servicioEmail, IUnitOfWork unitOfWork)
        {
            _pedidoRepo = pedidoRepo;
            _variacionRepo = variacionRepo;
            _clienteRepo = clienteRepo;
            _facturaRepo = facturaRepo;
            _envioRepo = envioRepo;
            _gestorFacturacion = gestorFacturacion;
            _gestorEnvio = gestorEnvio;
            _servicioEmail = servicioEmail;
            _unitOfWork = unitOfWork;
        }

        public async Task ConfirmarPagoAsync(int pedidoId)
        {
            var pedido = await _pedidoRepo.ObtenerPorIdAsync(pedidoId);
            if (pedido == null) throw new Exception("Pedido no encontrado.");
            if (pedido.EstadoPedido == EstadoPedido.Pagado) return;
            if (pedido.EstaVencido()) throw new Exception("El pedido ya está vencido.");
            pedido.MarcarPagado();

            var cliente = await _clienteRepo.ObtenerPorIdAsync(pedido.ClienteId);
            var facturaExistente = await _facturaRepo.ObtenerPorPedidoIdAsync(pedido.Id);
            var factura = facturaExistente ?? await _gestorFacturacion.GenerarFacturaAsync(pedido, cliente);

            var envioExistente = await _envioRepo.ObtenerPorPedidoIdAsync(pedido.Id);
            if (envioExistente == null) await _gestorEnvio.ProgramarDespachoAsync(pedido, cliente, pedido.TipoEnvio);

            foreach (var linea in pedido.Lineas)
            {
                var variacion = await _variacionRepo.ObtenerPorIdAsync(linea.VariacionId);
                variacion.DescontarStock(linea.Cantidad);
            }

            await _unitOfWork.GuardarAsync();
            await _servicioEmail.EnviarEmailPedidoAsync(pedido, cliente, "Mercado Pago", factura.NumeroFactura);
        }
    }
}
