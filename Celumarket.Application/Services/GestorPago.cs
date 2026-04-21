using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces;
using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Services
{
    public class GestorPago : IGestorPago
    {
        private readonly IGestorPedido _gestorPedido;
        private readonly IPagoRepository _pagoRepo;

        public GestorPago(IGestorPedido gestorPedido, IPagoRepository pagoRepo)
        {
            _gestorPedido = gestorPedido;
            _pagoRepo = pagoRepo;
        }

        public async Task GenerarPagoPendienteAsync(PagoDTOs.GenerarPagoPendienteDTO dto)
        {
            var pago = Pago.Pendiente(dto.PedidoId, dto.MetodoPagoId, dto.MontoTotal);

            await _pagoRepo.AgregarAsync(pago);
            await _pagoRepo.GuardarAsync();
        }

        public async Task ProcesarRespuestaPasarelaAsync(PagoDTOs.RespuestaPasarelaDTO dto)
        {
            var pagoPendiente = await _pagoRepo.ObtenerPorPedidoIdAsync(dto.PedidoId);
            if (pagoPendiente == null)
                throw new Exception("No se encontró un pago pendiente para este pedido.");

            if (dto.PagoAprobado)
            {
                pagoPendiente.Aprobar();
                await _gestorPedido.ConfirmarPagoAsync(dto.PedidoId);
            }
            else
            {
                pagoPendiente.Rechazar();
            }

            await _pagoRepo.GuardarAsync();
        }

        public async Task RegistrarPagoManualAsync(PagoDTOs.RegistrarPagoManualDTO dto)
        {
            var pagoPendiente = await _pagoRepo.ObtenerPorPedidoIdAsync(dto.PedidoId);
            if (pagoPendiente == null)
                throw new Exception("No se encontró un pago pendiente para este pedido.");

            pagoPendiente.Aprobar();
            await _gestorPedido.ConfirmarPagoAsync(dto.PedidoId);
            await _pagoRepo.GuardarAsync();
        }

    }
}
