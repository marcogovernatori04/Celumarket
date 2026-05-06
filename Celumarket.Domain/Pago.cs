using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Domain
{
    public enum EstadoPago { Pendiente, Aprobado, Rechazado }

    public class Pago
    {
        public const string EstadoPendiente = "Pendiente";
        public const string EstadoAprobado = "Aprobado";
        public const string EstadoRechazado = "Rechazado";

        public int Id { get; private set; }
        public int PedidoId { get; private set; }
        public int MetodoPagoId { get; private set; }
        public DateTime Fecha { get; private set; }
        public decimal Monto { get; private set; }
        public string Estado { get; private set; }
        public EstadoPago EstadoPago
        {
            get => Estado switch
            {
                EstadoPendiente => EstadoPago.Pendiente,
                EstadoAprobado => EstadoPago.Aprobado,
                EstadoRechazado => EstadoPago.Rechazado,
                _ => throw new InvalidOperationException($"Estado de pago inválido: {Estado}")
            };
        }

        protected Pago() { }

        private Pago(int pedidoId, int metodoPagoId, decimal monto, string estado)
        {
            if (pedidoId <= 0) throw new ArgumentException("Pedido inválido.");
            if (metodoPagoId <= 0) throw new ArgumentException("Método de pago inválido.");
            if (monto <= 0) throw new ArgumentException("El monto del pago debe ser mayor a cero.");
            PedidoId = pedidoId;
            MetodoPagoId = metodoPagoId;
            Fecha = DateTime.UtcNow;
            Monto = monto;
            Estado = estado;
        }

        public static Pago Pendiente(int pedidoId, int metodoPagoId, decimal monto)
            => new Pago(pedidoId, metodoPagoId, monto, EstadoPendiente);

        public void Aprobar()
        {
            if (EstadoPago == EstadoPago.Rechazado) throw new InvalidOperationException("No se puede aprobar un pago rechazado.");
            Estado = EstadoAprobado;
        }

        public void Rechazar()
        {
            if (EstadoPago == EstadoPago.Aprobado) throw new InvalidOperationException("No se puede rechazar un pago aprobado.");
            Estado = EstadoRechazado;
        }   
    }
}
