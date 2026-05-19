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
            public DireccionCheckoutDTO? DireccionEntrega { get; set; }
        }

        public class DireccionCheckoutDTO
        {
            public string Calle { get; set; } = string.Empty;
            public string Numero { get; set; } = string.Empty;
            public string? PisoDepto { get; set; }
            public string Localidad { get; set; } = string.Empty;
            public string Provincia { get; set; } = string.Empty;
            public int CodigoPostal { get; set; }
        }

        public class ReservaCheckoutDTO
        {
            public int ReservaId { get; set; }
            public DateTime FechaVencimientoUtc { get; set; }
            public int SegundosRestantes { get; set; }
        }

        public class DireccionEntregaDTO
        {
            public string Calle { get; set; } = string.Empty;
            public string Numero { get; set; } = string.Empty;
            public string PisoDepto { get; set; } = string.Empty;
            public string Localidad { get; set; } = string.Empty;
            public string Provincia { get; set; } = string.Empty;
            public int CodigoPostal { get; set; }
        }

        public class DetallePedidoClienteDTO
        {
            public int Id { get; set; }
            public string Estado { get; set; } = string.Empty;
            public DateTime Fecha { get; set; }
            public decimal MontoTotal { get; set; }
            public string MetodoPago { get; set; } = string.Empty;
            public string TipoEnvio { get; set; } = string.Empty;
            public decimal CostoEnvio { get; set; }
            public DireccionEntregaDTO? DireccionEntrega { get; set; }
            public DatosPagoMercadoPagoDTO? DatosPagoMercadoPago { get; set; }
            public List<DatosPagoMercadoPagoDTO> PagosMercadoPago { get; set; } = new();
            public List<LineaDetallePedidoClienteDTO> Lineas { get; set; } = new();
        }

        public class DatosPagoMercadoPagoDTO
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

        public class LineaDetallePedidoClienteDTO
        {
            public int Id { get; set; }
            public string Marca { get; set; } = string.Empty;
            public string Modelo { get; set; } = string.Empty;
            public string Color { get; set; } = string.Empty;
            public string UrlImagen { get; set; } = string.Empty;
            public int Cantidad { get; set; }
            public decimal PrecioUnitario { get; set; }
            public decimal Subtotal { get; set; }
        }

    }
}
