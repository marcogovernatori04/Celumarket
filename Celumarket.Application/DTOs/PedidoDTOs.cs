using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.DTOs
{
    public class PedidoDTOs
    {
        public class PedidoDetalleDTO
        {
            public int Id { get; set; }
            public DateTime Fecha { get; set; }
            public DateTime FechaVencimiento { get; set; }
            public string Estado { get; set; }
            public decimal MontoTotal { get; set; }
            public List<LineaPedidoDTO> Lineas { get; set; } = new List<LineaPedidoDTO>();
        }

        public class LineaPedidoDTO
        {
            public string Marca { get; set; }
            public string Modelo { get; set; }
            public string Color { get; set; }
            public int Cantidad { get; set; }
            public decimal PrecioUnitario { get; set; }
            public decimal Subtotal { get; set; }
        }

        public class CheckoutDTO
        {
            public int MetodoPagoId { get; set; }
            public TipoEnvio TipoEnvio { get; set; }
        }

    }
}
