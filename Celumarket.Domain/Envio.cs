namespace Celumarket.Domain
{
    public enum EstadoEnvio { Pendiente, Despachado, Entregado, Cancelado }
    public enum TipoEnvio { Domicilio, Correo, Local }

    public class Envio
    {
        public int Id { get; private set; }
        public EstadoEnvio Estado { get; private set; }
        public string? CodigoSeguimiento { get; private set; }
        public Direccion DireccionEntrega { get; private set; }
        public decimal Costo { get; private set; }
        public TipoEnvio Tipo { get; private set; } 
        public DateTime FechaEstimada { get; private set; }
        public DateTime? FechaDespacho { get; private set; }
        public int PedidoId { get; private set; }

        protected Envio() { }

        public Envio(int pedidoId, Direccion direccionEntrega, decimal costo, DateTime fechaEstimada, TipoEnvio tipo)
        {
            PedidoId = pedidoId;
            DireccionEntrega = direccionEntrega;
            Costo = costo;
            FechaEstimada = fechaEstimada;
            Tipo = tipo; 
            Estado = EstadoEnvio.Pendiente;
        }

        public void Despachar(string codigoSeguimiento)
        {
            if (Estado != EstadoEnvio.Pendiente) throw new InvalidOperationException("Solo se pueden despachar envíos pendientes.");
            if (string.IsNullOrWhiteSpace(codigoSeguimiento)) throw new ArgumentException("El código de seguimiento es obligatorio.");
            CodigoSeguimiento = codigoSeguimiento;
            FechaDespacho = DateTime.UtcNow;
            Estado = EstadoEnvio.Despachado;
        }

        public void Entregar()
        {
            if (Estado != EstadoEnvio.Despachado) throw new InvalidOperationException("Solo se pueden entregar envíos despachados.");
            Estado = EstadoEnvio.Entregado;
        }
    }
}
