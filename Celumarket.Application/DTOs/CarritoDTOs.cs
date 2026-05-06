using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.DTOs
{
    public class CarritoDTOs
    {
        public class AgregarItemDTO
        {
            public int VariacionId { get; set; }
            public int Cantidad { get; set; }
        }

        public class CarritoDetalleDTO
        {
            public int Id { get; set; }
            public int ClienteId { get; set; }
            public List<ItemCarritoDTO> Items { get; set; } = new List<ItemCarritoDTO>();

            public decimal Total => Items.Sum(i => i.Subtotal);
        }

        public class ItemCarritoDTO
        {
            public int VariacionId { get; set; }
            public string Marca { get; set; }
            public string Modelo { get; set; }  
            public string Color { get; set; }
            public int Cantidad { get; set; }
            public decimal PrecioUnitario { get; set; }
            public decimal Subtotal => PrecioUnitario * Cantidad;
            public string UrlImagen { get; set; }

        }
    }
}
