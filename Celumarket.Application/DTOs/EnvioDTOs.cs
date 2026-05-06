using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.DTOs
{
    public class EnvioDTOs
    {
        public class EnvioListadoDTO
        {
            public int EnvioId { get; set; }
            public int PedidoId { get; set; }
            public string Estado { get; set; }
            public string Tipo { get; set; }
            public decimal Costo { get; set; }
            public string DireccionEntrega { get; set; }
            public DateTime FechaEstimada { get; set; }
            public DateTime? FechaDespacho { get; set; }
            public string CodigoSeguimiento { get; set; }
        }

        public class DespacharEnvioDTO
        {
            public string NumeroSeguimiento { get; set; }
        }
    }
}
