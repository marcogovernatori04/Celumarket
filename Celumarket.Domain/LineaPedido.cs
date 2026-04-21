using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Domain
{
    public class LineaPedido
    {
        public int Id { get; private set; }

        public int PedidoId { get; private set; }
        public int VariacionCelularId { get; private set; }

        public int Cantidad { get; private set; }
        public decimal PrecioUnitario { get; private set; }

        public VariacionCelular VariacionCelular { get; private set; }

        protected LineaPedido() { }

        public LineaPedido(int variacionCelularId, int cantidad, decimal precioUnitario)
        {
            VariacionCelularId = variacionCelularId;
            Cantidad = cantidad;
            PrecioUnitario = precioUnitario;
        }

        public decimal CalcularSubtotal()
        {
            return Cantidad * PrecioUnitario;
        }
    }
}
