using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.DTOs
{
    public class ReportesDTOs
    {
        public class TopVentasDTO
        {
            public string Marca { get; set; }
            public string Modelo { get; set; }
            public int CantidadVendida { get; set; }
            public decimal TotalRecaudado { get; set; }
        }

        public class StockCriticoDTO
        {
            public int VariacionId { get; set; }
            public string MarcaModelo { get; set; }
            public decimal Precio { get; set; }
            public int StockActual { get; set; }
        }

        public class FacturacionDiariaDTO
        {
            public DateTime Fecha {  get; set; }
            public int CantidadPedidos { get; set; }
            public decimal TotalFacturado { get; set; }
        }

        public class DashboardDTO
        {
            public int TotalUsuarios { get; set; }
            public int PedidosPendientes { get; set; }
            public int ProductosSinStock { get; set; }
            public int TotalPedidos { get; set; }
            public decimal RecaudacionTotal { get; set; }
        }
    }
}
