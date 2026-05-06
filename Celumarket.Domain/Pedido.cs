using System;
using System.Collections.Generic;
using System.Linq;

namespace Celumarket.Domain
{
    public enum EstadoPedido { PendienteDePago, Pagado, Cancelado }

    public class Pedido
    {
        public const string EstadoPendienteDePago = "Pendiente de Pago";
        public const string EstadoPagado = "Pagado";
        public const string EstadoCancelado = "Cancelado";

        public int Id { get; private set; }
        public DateTime Fecha { get; private set; }
        public DateTime FechaVencimiento { get; private set; }
        public decimal DescuentoAplicado { get; private set; }
        public decimal CostoEnvio { get; private set; }
        public TipoEnvio TipoEnvio { get; private set; }
        public decimal MontoTotal => Lineas.Sum(l => l.CalcularSubtotal()) - DescuentoAplicado + CostoEnvio;
        public string Estado { get; private set; }
        public EstadoPedido EstadoPedido
        {
            get => Estado switch
            {
                EstadoPendienteDePago => EstadoPedido.PendienteDePago,
                EstadoPagado => EstadoPedido.Pagado,
                EstadoCancelado => EstadoPedido.Cancelado,
                _ => throw new InvalidOperationException($"Estado de pedido inválido: {Estado}")
            };
        }
        public int ClienteId { get; private set; }
        public List<LineaPedido> Lineas { get; private set; } = new List<LineaPedido>();

        public Direccion DireccionEntrega { get; private set; }

        protected Pedido() { }

        public Pedido(int clienteId, int tiempoParaPagar)
        {
            if (clienteId <= 0) throw new ArgumentException("Cliente inválido.");
            if (tiempoParaPagar <= 0) throw new ArgumentException("El plazo de pago debe ser mayor a cero.");
            ClienteId = clienteId;
            Fecha = DateTime.UtcNow;
            FechaVencimiento = Fecha.AddMinutes(tiempoParaPagar);
            Estado = EstadoPendienteDePago;
        }

        public void AgregarLinea(int variacionCelularId, int cantidad, decimal precioUnitario)
        {
            if (variacionCelularId <= 0) throw new ArgumentException("Variación inválida.");
            var nuevaLinea = new LineaPedido(variacionCelularId, cantidad, precioUnitario);
            Lineas.Add(nuevaLinea);
        }

        public void AgregarCostoEnvio(decimal costoEnvio)
        {
            if (costoEnvio < 0) throw new ArgumentException("El costo de envío no puede ser negativo.");
            CostoEnvio = costoEnvio;
        }

        public void AsignarTipoEnvio(TipoEnvio tipoEnvio)
        {
            TipoEnvio = tipoEnvio;
        }

        public void AsignarDireccion(Direccion direccion)
        {
            if (direccion == null) throw new ArgumentNullException(nameof(direccion));
            DireccionEntrega = new Direccion(
                direccion.Calle,
                direccion.Numero,
                direccion.PisoDepto,
                direccion.Localidad,
                direccion.Provincia,
                direccion.CodigoPostal);
        }

        public void AplicarDescuento(decimal descuento)
        {
            if (descuento < 0 || descuento > Lineas.Sum(l => l.CalcularSubtotal()))
                throw new ArgumentException("Descuento inválido.");
            DescuentoAplicado = descuento;
        }

        public void MarcarPagado()
        {
            if (EstadoPedido == EstadoPedido.Cancelado) throw new InvalidOperationException("No se puede pagar un pedido cancelado.");
            Estado = EstadoPagado;
        }

        public void MarcarCancelado()
        {
            if (EstadoPedido == EstadoPedido.Pagado) throw new InvalidOperationException("No se puede cancelar un pedido que ya fue pagado.");
            Estado = EstadoCancelado;
        }

        public bool EstaVencido()
        {
            return DateTime.UtcNow > FechaVencimiento && EstadoPedido == EstadoPedido.PendienteDePago;
        }
    }
}
