using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
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
        private readonly IMetodoPagoRepository _metodoPagoRepo;
        private readonly IUnitOfWork _unitOfWork;   

        public GestorPago(
            IGestorPedido gestorPedido, 
            IPagoRepository pagoRepo, 
            IMetodoPagoRepository metodoPagoRepo, 
            IUnitOfWork unitOfWork)
        {
            _gestorPedido = gestorPedido;
            _pagoRepo = pagoRepo;
            _metodoPagoRepo = metodoPagoRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<int> GenerarPagoPendienteAsync(PagoDTOs.GenerarPagoPendienteDTO dto)
        {
            var metodo = await _metodoPagoRepo.ObtenerPorIdAsync(dto.MetodoPagoId);
            if (metodo == null)
                throw new Exception("Método de pago no encontrado.");

            var pago = Pago.Pendiente(dto.PedidoId, dto.MetodoPagoId, dto.MontoTotal);

            await _pagoRepo.AgregarAsync(pago);
            await _unitOfWork.GuardarAsync();

            return pago.Id;
        }

        public async Task ProcesarRespuestaPasarelaAsync(PagoDTOs.RespuestaPasarelaDTO dto)
        {
            var pagoPendiente = await _pagoRepo.ObtenerPorPedidoIdAsync(dto.PedidoId);
            if (dto.PagoAprobado)
            {
                if (pagoPendiente != null)
                {
                    pagoPendiente.Aprobar();
                }

                await _gestorPedido.ConfirmarPagoAsync(dto.PedidoId);
            }
            else
            {
                if (pagoPendiente == null)
                    throw new Exception("No se encontró un pago pendiente para este pedido.");

                pagoPendiente.Rechazar();
            }

            await _unitOfWork.GuardarAsync();
        }

        public async Task RegistrarPagoManualAsync(PagoDTOs.RegistrarPagoManualDTO dto)
        {
            var pagoPendiente = await _pagoRepo.ObtenerPorPedidoIdAsync(dto.PedidoId);
            if (pagoPendiente != null)
            {
                pagoPendiente.Aprobar();
            }

            await _gestorPedido.ConfirmarPagoAsync(dto.PedidoId);
            await _unitOfWork.GuardarAsync();
        }

    }
}
