using System;

namespace Celumarket.Domain
{
    public enum TipoFactura { A, B, C }

    public class Factura
    {
        public int Id { get; private set; }
        public DateTime FechaEmision { get; private set; }
        public decimal MontoTotal { get; private set; }
        public TipoFactura Tipo { get; private set; }
        
        // receptor
        public string NombreReceptor { get; private set; }
        public string DniReceptor { get; private set; }


        // arca mock
        public string NumeroFactura { get; private set; }
        public string CAE { get; private set; }
        public DateTime? VencimientoCAE { get; private set; }

        public int PedidoId { get; private set; }

        protected Factura() { }

        public Factura(int pedidoId, decimal montoTotal, TipoFactura tipoFactura, string nombreReceptor, string dniReceptor)
        {
            PedidoId = pedidoId;
            MontoTotal = montoTotal;
            Tipo = tipoFactura;
            FechaEmision = DateTime.UtcNow;
            NombreReceptor = nombreReceptor;
            DniReceptor = dniReceptor;
            NumeroFactura = "Pendiente";
            CAE = "Pendiente";
        }

        public void RegistrarRespuestaARCA(string nroFactura, string cae, DateTime vencimiento)
        {
            NumeroFactura = nroFactura;
            CAE = cae;
            VencimientoCAE = vencimiento;
        }
    }
}