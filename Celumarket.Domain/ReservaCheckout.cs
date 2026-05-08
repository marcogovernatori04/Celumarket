using System;
using System.Collections.Generic;
using System.Linq;

namespace Celumarket.Domain
{
    public enum EstadoReservaCheckout
    {
        Activa,
        Consumida,
        Vencida,
        Cancelada
    }

    public class ReservaCheckout
    {
        public int Id { get; private set; }
        public int ClienteId { get; private set; }
        public DateTime FechaCreacionUtc { get; private set; }
        public DateTime FechaVencimientoUtc { get; private set; }
        public EstadoReservaCheckout Estado { get; private set; }
        public List<ReservaCheckoutItem> Items { get; private set; } = new();

        protected ReservaCheckout() { }

        public ReservaCheckout(int clienteId, int minutosReserva)
        {
            if (clienteId <= 0) throw new ArgumentException("Cliente inválido.");
            if (minutosReserva <= 0) throw new ArgumentException("El plazo de reserva debe ser mayor a cero.");

            ClienteId = clienteId;
            FechaCreacionUtc = DateTime.UtcNow;
            FechaVencimientoUtc = FechaCreacionUtc.AddMinutes(minutosReserva);
            Estado = EstadoReservaCheckout.Activa;
        }

        public bool EstaActiva() => Estado == EstadoReservaCheckout.Activa && DateTime.UtcNow <= FechaVencimientoUtc;

        public bool EstaVencida() => Estado == EstadoReservaCheckout.Activa && DateTime.UtcNow > FechaVencimientoUtc;

        public void AgregarItem(int variacionId, int cantidad)
        {
            if (Estado != EstadoReservaCheckout.Activa)
                throw new InvalidOperationException("Solo se pueden agregar items en reservas activas.");
            if (variacionId <= 0) throw new ArgumentException("Variación inválida.");
            if (cantidad <= 0) throw new ArgumentException("Cantidad inválida.");

            Items.Add(new ReservaCheckoutItem(variacionId, cantidad));
        }

        public void MarcarConsumida()
        {
            if (Estado != EstadoReservaCheckout.Activa)
                throw new InvalidOperationException("Solo una reserva activa puede consumirse.");
            Estado = EstadoReservaCheckout.Consumida;
        }

        public void ReiniciarVencimiento(int minutosReserva)
        {
            if (Estado != EstadoReservaCheckout.Activa)
                throw new InvalidOperationException("Solo una reserva activa puede reiniciar vencimiento.");
            if (minutosReserva <= 0)
                throw new ArgumentException("El plazo de reserva debe ser mayor a cero.");

            FechaVencimientoUtc = DateTime.UtcNow.AddMinutes(minutosReserva);
        }

        public void MarcarVencida()
        {
            if (Estado != EstadoReservaCheckout.Activa) return;
            Estado = EstadoReservaCheckout.Vencida;
        }

        public void MarcarCancelada()
        {
            if (Estado != EstadoReservaCheckout.Activa) return;
            Estado = EstadoReservaCheckout.Cancelada;
        }
    }
}
