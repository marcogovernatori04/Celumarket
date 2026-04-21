using System;

namespace Celumarket.Domain
{
    public class Factura
    {
        public int Id { get; private set; }
        public DateTime FechaEmision { get; private set; }
        public string TipoComprobante { get; private set; }
        public string NumeroComprobante { get; private set; }

        public int PedidoId { get; private set; }

        protected Factura() { }

        public Factura(int pedidoId, string tipoComprobante, string numeroComprobante)
        {
            PedidoId = pedidoId;
            TipoComprobante = tipoComprobante;
            NumeroComprobante = numeroComprobante;
            FechaEmision = DateTime.UtcNow;
        }
    }
}