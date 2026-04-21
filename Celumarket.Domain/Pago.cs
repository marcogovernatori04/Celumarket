using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Domain
{
    public class Pago
    {
        public int Id { get; private set; }
        public int PedidoId { get; private set; }
        public int MetodoPagoId { get; private set; }
        public DateTime Fecha { get; private set; }
        public decimal Monto { get; private set; }
        public string Estado { get; private set; }

        protected Pago() { }

        private Pago(int pedidoId, int metodoPagoId, decimal monto, string estado)
        {
            PedidoId = pedidoId;
            MetodoPagoId = metodoPagoId;
            Fecha = DateTime.UtcNow;
            Monto = monto;
            Estado = estado;
        }

        public static Pago Pendiente(int pedidoId, int metodoPagoId, decimal monto)
            => new Pago(pedidoId, metodoPagoId, monto, "Pendiente");

        public static Pago Aprobado(int pedidoId, int metodoPagoId, decimal monto)
            => new Pago(pedidoId, metodoPagoId, monto, "Aprobado");

        public static Pago Rechazado(int pedidoId, int metodoPagoId, decimal monto)
            => new Pago(pedidoId, metodoPagoId, monto, "Rechazado");

        public void Aprobar()
        {
            Estado = "Aprobado";
        }

        public void Rechazar()
        {
            Estado = "Rechazado";
        }   
    }
}
