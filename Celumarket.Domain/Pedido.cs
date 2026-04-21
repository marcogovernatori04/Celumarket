using System;
using System.Collections.Generic;
using System.Linq;

namespace Celumarket.Domain
{
    public class Pedido
    {
        public int Id { get; private set; }
        public DateTime Fecha { get; private set; }
        public DateTime FechaVencimiento { get; private set; }

        public decimal MontoTotal => Lineas.Sum(l => l.CalcularSubtotal());
        public string Estado { get; private set; }

        public int ClienteId { get; private set; }
        public List<LineaPedido> Lineas { get; private set; } = new List<LineaPedido>();

        protected Pedido() { }

        public Pedido(int clienteId, int tiempoParaPagar)
        {
            ClienteId = clienteId;
            Fecha = DateTime.UtcNow;
            FechaVencimiento = Fecha.AddMinutes(tiempoParaPagar);
            Estado = "Pendiente de Pago";
        }

        public void AgregarLinea(int variacionCelularId, int cantidad, decimal precioUnitario)
        {
            var nuevaLinea = new LineaPedido(variacionCelularId, cantidad, precioUnitario);
            Lineas.Add(nuevaLinea);
        }

        public void MarcarPagado()
        {
            if (Estado == "Cancelado") throw new InvalidOperationException("No se puede pagar un pedido cancelado.");
            Estado = "Pagado";
        }

        public void MarcarCancelado()
        {
            if (Estado == "Pagado") throw new InvalidOperationException("No se puede cancelar un pedido que ya fue pagado.");
            Estado = "Cancelado";
        }

        public bool EstaVencido()
        {
            return DateTime.UtcNow > FechaVencimiento && Estado == "Pendiente de Pago";
        }
    }
}