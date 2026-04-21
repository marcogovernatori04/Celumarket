using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Domain
{
    public class Envio
    {
        public int Id { get; private set; }
        public int CodigoPostal { get; private set; }
        public decimal Costo { get; private set; }
        public string DireccionEntrega { get; private set; }
        public DateTime FechaEstimada { get; private set; }
        public string Estado { get; private set; }

        public int PedidoId { get; private set; }

        protected Envio() { }

        public Envio(int codigoPostal, decimal costo, string direccionEntrega, DateTime fechaEstimada, int pedidoId)
        {
            CodigoPostal = codigoPostal;
            Costo = costo;
            DireccionEntrega = direccionEntrega;
            FechaEstimada = fechaEstimada;
            Estado = "Pendiente";
            PedidoId = pedidoId;
        }

        public void Despachar() => Estado = "Despachado";
        public void Entregar() => Estado = "Entregado";



    }
}
