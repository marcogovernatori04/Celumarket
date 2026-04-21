using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces;
using Celumarket.Domain;

namespace Celumarket.Application.Services
{
    public class GestorPedido : IGestorPedido
    {
        private readonly IPedidoRepository _pedidoRepository;
        private readonly IVariacionRepository _variacionRepository;
        private readonly IMetodoPagoRepository _metodoPagoRepo;

        public GestorPedido(IPedidoRepository pedidoRepository, IVariacionRepository variacionRepository, IMetodoPagoRepository metodoPagoRepo)
        {
            _pedidoRepository = pedidoRepository;
            _variacionRepository = variacionRepository;
            _metodoPagoRepo = metodoPagoRepo;
        }

        public async Task<int> GenerarPedidoAsync(int clienteId, int metodoPagoId, List<ItemCarritoDTO> items)
        {
            var metodoPago = await _metodoPagoRepo.ObtenerPorIdAsync(metodoPagoId);
            if (metodoPago == null) throw new Exception("Método de pago no encontrado.");

            var nuevoPedido = new Pedido(clienteId, metodoPago.MinutosPlazo);

            foreach (var item in items)
            {
                var variacion = await _variacionRepository.ObtenerPorIdAsync(item.VariacionId);

                variacion.BloquearStock(item.Cantidad);

                nuevoPedido.AgregarLinea(variacion.Id, item.Cantidad, variacion.Precio);
            }

            await _pedidoRepository.AgregarAsync(nuevoPedido);
            await _pedidoRepository.GuardarAsync();

            return nuevoPedido.Id;
        }

        public async Task ConfirmarPagoAsync(int pedidoId)
        {
            var pedido = await _pedidoRepository.ObtenerPorIdAsync(pedidoId);
            if (pedido == null) throw new Exception("Pedido no encontrado.");

            if (pedido.EstaVencido()) throw new Exception("El pedido ya está vencido.");

            pedido.MarcarPagado();

            foreach (var linea in pedido.Lineas)
            {
                var variacion = await _variacionRepository.ObtenerPorIdAsync(linea.VariacionCelularId);
                variacion.DescontarStock(linea.Cantidad);
            }

            await _pedidoRepository.GuardarAsync();
        }

        public async Task CancelarPedidoAsync(int pedidoId)
        {
            var pedido = await _pedidoRepository.ObtenerPorIdAsync(pedidoId);
            if (pedido == null) throw new Exception("Pedido no encontrado.");

            pedido.MarcarCancelado();

            foreach (var linea in pedido.Lineas)
            {
                var variacion = await _variacionRepository.ObtenerPorIdAsync(linea.VariacionCelularId);
                variacion.LiberarBloqueo(linea.Cantidad);
            }

            await _pedidoRepository.GuardarAsync();
        }
    }
}