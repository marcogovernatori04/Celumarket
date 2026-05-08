using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;

namespace Celumarket.Application.Services.Pedidos
{
    public class GestorReservaCheckout : IGestorReservaCheckout
    {
        private const int MinutosReservaCheckout = 10;

        private readonly IReservaCheckoutRepository _reservaRepo;
        private readonly IVariacionRepository _variacionRepo;
        private readonly IUnitOfWork _unitOfWork;

        public GestorReservaCheckout(IReservaCheckoutRepository reservaRepo, IVariacionRepository variacionRepo, IUnitOfWork unitOfWork)
        {
            _reservaRepo = reservaRepo;
            _variacionRepo = variacionRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<PedidoDTOs.ReservaCheckoutDTO> IniciarReservaAsync(int clienteId, List<CarritoDTOs.ItemCarritoDTO> items)
        {
            if (items == null || items.Count == 0)
                throw new Exception("No hay items para reservar.");

            var activa = await _reservaRepo.ObtenerActivaPorClienteIdAsync(clienteId);
            if (activa != null)
            {
                if (!activa.EstaVencida())
                {
                    var restantes = (int)Math.Max(0, Math.Ceiling((activa.FechaVencimientoUtc - DateTime.UtcNow).TotalSeconds));
                    return new PedidoDTOs.ReservaCheckoutDTO
                    {
                        ReservaId = activa.Id,
                        FechaVencimientoUtc = activa.FechaVencimientoUtc,
                        SegundosRestantes = restantes
                    };
                }

                foreach (var item in activa.Items)
                {
                    var variacionVencida = await _variacionRepo.ObtenerPorIdAsync(item.VariacionId);
                    variacionVencida.LiberarBloqueo(item.Cantidad);
                }
                activa.MarcarVencida();
            }

            var reserva = new ReservaCheckout(clienteId, MinutosReservaCheckout);

            foreach (var item in items)
            {
                var variacion = await _variacionRepo.ObtenerPorIdAsync(item.VariacionId);
                variacion.BloquearStock(item.Cantidad);
                reserva.AgregarItem(item.VariacionId, item.Cantidad);
            }

            await _reservaRepo.AgregarAsync(reserva);
            await _unitOfWork.GuardarAsync();

            return new PedidoDTOs.ReservaCheckoutDTO
            {
                ReservaId = reserva.Id,
                FechaVencimientoUtc = reserva.FechaVencimientoUtc,
                SegundosRestantes = (int)Math.Ceiling((reserva.FechaVencimientoUtc - DateTime.UtcNow).TotalSeconds)
            };
        }

        public async Task ExpirarReservasVencidasAsync(DateTime ahoraUtc, CancellationToken cancellationToken)
        {
            var vencidas = await _reservaRepo.ObtenerActivasVencidasAsync(ahoraUtc);
            foreach (var reserva in vencidas)
            {
                cancellationToken.ThrowIfCancellationRequested();
                foreach (var item in reserva.Items)
                {
                    var variacion = await _variacionRepo.ObtenerPorIdAsync(item.VariacionId);
                    variacion.LiberarBloqueo(item.Cantidad);
                }
                reserva.MarcarVencida();
            }

            if (vencidas.Count > 0)
                await _unitOfWork.GuardarAsync();
        }
    }
}
