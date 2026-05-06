using Celumarket.Application.Interfaces;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;

namespace Celumarket.Application.Services.Pedidos
{
    public class GestorCancelacionPedido : IGestorCancelacionPedido
    {
        private readonly IPedidoRepository _pedidoRepo;
        private readonly IVariacionRepository _variacionRepo;
        private readonly IUnitOfWork _unitOfWork;

        public GestorCancelacionPedido(IPedidoRepository pedidoRepo, IVariacionRepository variacionRepo, IUnitOfWork unitOfWork)
        {
            _pedidoRepo = pedidoRepo;
            _variacionRepo = variacionRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task CancelarPedidoAsync(int pedidoId)
        {
            var pedido = await _pedidoRepo.ObtenerPorIdAsync(pedidoId);
            if (pedido == null) throw new Exception("Pedido no encontrado.");
            pedido.MarcarCancelado();

            foreach (var linea in pedido.Lineas)
            {
                var variacion = await _variacionRepo.ObtenerPorIdAsync(linea.VariacionId);
                variacion.LiberarBloqueo(linea.Cantidad);
            }

            await _unitOfWork.GuardarAsync();
        }
    }
}
