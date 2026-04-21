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
        }

        public class RegistrarPagoManualDTO
        {
            public int PedidoId { get; set; }
        }
    }
}
