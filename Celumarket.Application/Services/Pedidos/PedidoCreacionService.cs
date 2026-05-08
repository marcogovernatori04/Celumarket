using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;

namespace Celumarket.Application.Services.Pedidos
{
    public class GestorCreacionPedido : IGestorCreacionPedido
    {
        private readonly IPedidoRepository _pedidoRepo;
        private readonly IVariacionRepository _variacionRepo;
        private readonly IMetodoPagoRepository _metodoPagoRepo;
        private readonly IGestorPromociones _gestorPromociones;
        private readonly IClienteRepository _clienteRepo;
        private readonly IGestorEnvio _gestorEnvio;
        private readonly IServicioEmail _servicioEmail;
        private readonly IUnitOfWork _unitOfWork;

        public GestorCreacionPedido(
            IPedidoRepository pedidoRepo,
            IVariacionRepository variacionRepo,
            IMetodoPagoRepository metodoPagoRepo,
            IGestorPromociones gestorPromociones,
            IClienteRepository clienteRepo,
            IGestorEnvio gestorEnvio,
            IServicioEmail servicioEmail,
            IUnitOfWork unitOfWork)
        {
            _pedidoRepo = pedidoRepo;
            _variacionRepo = variacionRepo;
            _metodoPagoRepo = metodoPagoRepo;
            _gestorPromociones = gestorPromociones;
            _clienteRepo = clienteRepo;
            _gestorEnvio = gestorEnvio;
            _servicioEmail = servicioEmail;
            _unitOfWork = unitOfWork;
        }

        public async Task<int> GenerarPedidoAsync(int clienteId, int metodoPagoId, TipoEnvio tipoEnvio, List<CarritoDTOs.ItemCarritoDTO> items, bool stockYaBloqueado = false)
        {
            var metodoPago = await _metodoPagoRepo.ObtenerPorIdAsync(metodoPagoId);
            if (metodoPago == null) throw new Exception("Método de pago no encontrado.");
            var cliente = await _clienteRepo.ObtenerPorIdAsync(clienteId);
            if (cliente == null) throw new Exception("Cliente no encontrado.");

            var nuevoPedido = new Pedido(clienteId, metodoPago.MinutosPlazo);
            decimal subtotal = 0;
            foreach (var item in items)
            {
                var variacion = await _variacionRepo.ObtenerPorIdAsync(item.VariacionId);
                if (!stockYaBloqueado)
                {
                    variacion.BloquearStock(item.Cantidad);
                }
                nuevoPedido.AgregarLinea(variacion.Id, item.Cantidad, variacion.Precio);
                subtotal += item.Cantidad * variacion.Precio;
            }

            bool esTransferencia = metodoPago.Nombre.ToLower().Contains("transferencia");
            decimal totalConDescuento = await _gestorPromociones.AplicarDescuentoPorTransferenciaAsync(subtotal, esTransferencia);
            decimal diferenciaDescuento = subtotal - totalConDescuento;
            if (diferenciaDescuento > 0) nuevoPedido.AplicarDescuento(diferenciaDescuento);

            nuevoPedido.AsignarTipoEnvio(tipoEnvio);
            nuevoPedido.AsignarDireccion(cliente.Direccion);
            decimal costoEnvio = await _gestorEnvio.CalcularCostoEnvioAsync(cliente.Direccion.CodigoPostal, totalConDescuento, tipoEnvio);
            if (costoEnvio > 0) nuevoPedido.AgregarCostoEnvio(costoEnvio);

            await _pedidoRepo.AgregarAsync(nuevoPedido);
            await _unitOfWork.GuardarAsync();

            if (esTransferencia) await _servicioEmail.EnviarEmailPedidoAsync(nuevoPedido, cliente, metodoPago.Nombre);
            return nuevoPedido.Id;
        }
    }
}
