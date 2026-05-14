using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.DTOs
{
    public class PagoDTOs
    {
        public class GenerarPagoPendienteDTO
        {
            public int PedidoId { get; set; }
            public int MetodoPagoId { get; set; }   
            public decimal MontoTotal { get; set; }
        }

        public class RespuestaPasarelaDTO
        {
            public int PedidoId { get; set; }
            public bool PagoAprobado { get; set; }  
            public DatosMercadoPagoDTO? DatosMercadoPago { get; set; }
        }

        public class DatosMercadoPagoDTO
        {
            public string? PaymentIdExterno { get; set; }
            public string? MetodoPagoId { get; set; }
            public string? TipoPagoId { get; set; }
            public int Cuotas { get; set; }
            public decimal? ValorCuota { get; set; }
            public decimal? MontoTotalFinal { get; set; }
            public decimal? MontoPagado { get; set; }
            public decimal? MontoNetoRecibido { get; set; }
            public DateTime? FechaAprobacionUtc { get; set; }
        }

        public class RegistrarPagoManualDTO
        {
            public int PedidoId { get; set; }
        }
    }
}
