using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces.Services;
using Celumarket.Application.Services.Pedidos;
using Celumarket.Domain;

namespace Celumarket.Application.Services
{
    public class GestorPedido : IGestorPedido
    {
        private readonly IGestorCreacionPedido _creacionService;
        private readonly IGestorPagoPedido _pagoService;
        private readonly IGestorCancelacionPedido _cancelacionService;

        public GestorPedido(IGestorCreacionPedido creacionService, IGestorPagoPedido pagoService, IGestorCancelacionPedido cancelacionService)
        {
            _creacionService = creacionService;
            _pagoService = pagoService;
            _cancelacionService = cancelacionService;
        }

        public Task<int> GenerarPedidoAsync(int clienteId, int metodoPagoId, TipoEnvio tipoEnvio, List<CarritoDTOs.ItemCarritoDTO> items, Direccion? direccionEntregaOverride = null, bool stockYaBloqueado = false)
            => _creacionService.GenerarPedidoAsync(clienteId, metodoPagoId, tipoEnvio, items, direccionEntregaOverride, stockYaBloqueado);

        public Task ConfirmarPagoAsync(int pedidoId)
            => _pagoService.ConfirmarPagoAsync(pedidoId);

        public Task CancelarPedidoAsync(int pedidoId)
            => _cancelacionService.CancelarPedidoAsync(pedidoId);
    }
}
