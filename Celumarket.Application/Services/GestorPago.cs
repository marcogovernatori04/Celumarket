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
        private readonly IPedidoRepository _pedidoRepo;
        private readonly IUnitOfWork _unitOfWork;   

        public GestorPago(
            IGestorPedido gestorPedido, 
            IPagoRepository pagoRepo, 
            IMetodoPagoRepository metodoPagoRepo, 
            IPedidoRepository pedidoRepo,
            IUnitOfWork unitOfWork)
        {
            _gestorPedido = gestorPedido;
            _pagoRepo = pagoRepo;
            _metodoPagoRepo = metodoPagoRepo;
            _pedidoRepo = pedidoRepo;
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
            const decimal toleranciaCentavos = 0.01m;
            var pedido = await _pedidoRepo.ObtenerPorIdAsync(dto.PedidoId);
            var montoObjetivo = pagoPendiente?.Monto ?? pedido?.MontoTotal ?? 0m;
            decimal montoAprobadoEnEsteEvento = 0m;
            if (dto.PagoAprobado)
            {
                int? metodoMercadoPagoId = pagoPendiente?.MetodoPagoId;
                if (!metodoMercadoPagoId.HasValue)
                {
                    var metodos = await _metodoPagoRepo.ObtenerTodosAsync();
                    metodoMercadoPagoId = metodos
                        .FirstOrDefault(m => m.Nombre.Contains("mercado", StringComparison.OrdinalIgnoreCase))
                        ?.Id;
                }

                if (dto.DatosMercadoPago != null && metodoMercadoPagoId.HasValue)
                {
                    var paymentIdExterno = dto.DatosMercadoPago.PaymentIdExterno?.Trim();
                    if (!string.IsNullOrWhiteSpace(paymentIdExterno))
                    {
                        var yaExiste = await _pagoRepo.ExistePagoMercadoPagoPorExternoAsync(dto.PedidoId, paymentIdExterno);
                        if (yaExiste)
                        {
                            if (pagoPendiente != null)
                            {
                                var totalAprobadoExistente = await _pagoRepo.ObtenerTotalAprobadoPorPedidoIdAsync(dto.PedidoId);
                                if (montoObjetivo > 0 && totalAprobadoExistente + toleranciaCentavos >= montoObjetivo)
                                {
                                    if (pagoPendiente.DatosMercadoPago == null)
                                        pagoPendiente.Rechazar();
                                    else
                                        pagoPendiente.Aprobar();
                                    await _gestorPedido.ConfirmarPagoAsync(dto.PedidoId);
                                }
                            }

                            await _unitOfWork.GuardarAsync();
                            return;
                        }
                    }

                    var montoEvento = dto.DatosMercadoPago.MontoPagado
                        ?? dto.DatosMercadoPago.MontoTotalFinal
                        ?? 0m;

                    if (montoEvento > 0)
                    {
                        var pagoEvento = Pago.Pendiente(dto.PedidoId, metodoMercadoPagoId.Value, montoEvento);
                        pagoEvento.AsignarDatosMercadoPago(new DatosMercadoPago(
                            dto.DatosMercadoPago.PaymentIdExterno,
                            dto.DatosMercadoPago.MetodoPagoId,
                            dto.DatosMercadoPago.TipoPagoId,
                            dto.DatosMercadoPago.Cuotas,
                            dto.DatosMercadoPago.ValorCuota,
                            dto.DatosMercadoPago.MontoTotalFinal,
                            dto.DatosMercadoPago.MontoPagado,
                            dto.DatosMercadoPago.MontoNetoRecibido,
                            dto.DatosMercadoPago.FechaAprobacionUtc));
                        pagoEvento.Aprobar();
                        await _pagoRepo.AgregarAsync(pagoEvento);
                        montoAprobadoEnEsteEvento = montoEvento;
                    }
                }

                if (pagoPendiente != null)
                {
                    var totalAprobado = await _pagoRepo.ObtenerTotalAprobadoPorPedidoIdAsync(dto.PedidoId) + montoAprobadoEnEsteEvento;
                    if (montoObjetivo > 0 && totalAprobado + toleranciaCentavos >= montoObjetivo)
                    {
                        if (pagoPendiente.DatosMercadoPago == null)
                            pagoPendiente.Rechazar();
                        else
                            pagoPendiente.Aprobar();
                        await _gestorPedido.ConfirmarPagoAsync(dto.PedidoId);
                    }
                }
                else
                {
                    var totalAprobado = await _pagoRepo.ObtenerTotalAprobadoPorPedidoIdAsync(dto.PedidoId) + montoAprobadoEnEsteEvento;
                    if (montoObjetivo > 0 && totalAprobado + toleranciaCentavos >= montoObjetivo)
                        await _gestorPedido.ConfirmarPagoAsync(dto.PedidoId);
                }
            }
            else
            {
                if (pagoPendiente == null)
                {
                    await _unitOfWork.GuardarAsync();
                    return;
                }

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
