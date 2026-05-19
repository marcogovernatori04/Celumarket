using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;

namespace Celumarket.Application.Services
{
    public class GestorConsultaPedido : IGestorConsultaPedido
    {
        private readonly IPedidoRepository _pedidoRepo;
        private readonly IPagoRepository _pagoRepo;
        private readonly IMetodoPagoRepository _metodoPagoRepo;
        private readonly IClienteRepository _clienteRepo;
        private readonly ITarifaZonalRepository _tarifaRepo;

        public GestorConsultaPedido(
            IPedidoRepository pedidoRepo,
            IPagoRepository pagoRepo,
            IMetodoPagoRepository metodoPagoRepo,
            IClienteRepository clienteRepo,
            ITarifaZonalRepository tarifaRepo)
        {
            _pedidoRepo = pedidoRepo;
            _pagoRepo = pagoRepo;
            _metodoPagoRepo = metodoPagoRepo;
            _clienteRepo = clienteRepo;
            _tarifaRepo = tarifaRepo;
        }

        public async Task<PedidoDTOs.DetallePedidoClienteDTO?> ObtenerDetallePedidoClienteAsync(int clienteId, int pedidoId)
        {
            var pedido = await _pedidoRepo.ObtenerPorIdAsync(pedidoId);
            if (pedido == null || pedido.ClienteId != clienteId)
                return null;

            var ultimoPago = await _pagoRepo.ObtenerUltimoPorPedidoIdAsync(pedidoId);
            var pagosAprobadosMp = await _pagoRepo.ObtenerAprobadosPorPedidoIdAsync(pedidoId);
            string metodoPago = "No informado";
            if (ultimoPago != null)
            {
                var metodo = await _metodoPagoRepo.ObtenerPorIdAsync(ultimoPago.MetodoPagoId);
                metodoPago = metodo?.Nombre ?? "No informado";
            }

            string tipoEnvio = pedido.TipoEnvio switch
            {
                TipoEnvio.Domicilio => "Envío a domicilio",
                TipoEnvio.Correo => "Envío a sucursal de correo",
                TipoEnvio.Local => "Retiro en sucursal",
                _ => "No informado"
            };

            PedidoDTOs.DireccionEntregaDTO? direccionEntrega = null;
            if (pedido.TipoEnvio == TipoEnvio.Domicilio && pedido.DireccionEntrega != null)
            {
                direccionEntrega = new PedidoDTOs.DireccionEntregaDTO
                {
                    Calle = pedido.DireccionEntrega.Calle,
                    Numero = pedido.DireccionEntrega.Numero,
                    PisoDepto = pedido.DireccionEntrega.PisoDepto,
                    Localidad = pedido.DireccionEntrega.Localidad,
                    Provincia = pedido.DireccionEntrega.Provincia,
                    CodigoPostal = pedido.DireccionEntrega.CodigoPostal
                };
            }
            else if (pedido.TipoEnvio == TipoEnvio.Correo)
            {
                var cliente = await _clienteRepo.ObtenerPorIdAsync(clienteId);
                var tarifa = await _tarifaRepo.ObtenerTarifaPorCPAsync(cliente.Direccion.CodigoPostal);
                if (tarifa != null)
                {
                    direccionEntrega = new PedidoDTOs.DireccionEntregaDTO
                    {
                        Calle = tarifa.SucursalCorreoCalle,
                        Numero = tarifa.SucursalCorreoNumero,
                        PisoDepto = tarifa.SucursalCorreoPisoDepto,
                        Localidad = tarifa.SucursalCorreoLocalidad,
                        Provincia = tarifa.SucursalCorreoProvincia,
                        CodigoPostal = tarifa.SucursalCorreoCodigoPostal
                    };
                }
            }
            else if (pedido.TipoEnvio == TipoEnvio.Local)
            {
                direccionEntrega = new PedidoDTOs.DireccionEntregaDTO
                {
                    Calle = "Mitre",
                    Numero = "333",
                    PisoDepto = "",
                    Localidad = "San Nicolás de los Arroyos",
                    Provincia = "Buenos Aires",
                    CodigoPostal = 2900
                };
            }

            return new PedidoDTOs.DetallePedidoClienteDTO
            {
                Id = pedido.Id,
                Estado = pedido.Estado,
                Fecha = pedido.Fecha,
                MontoTotal = pedido.MontoTotal,
                MetodoPago = metodoPago,
                TipoEnvio = tipoEnvio,
                CostoEnvio = pedido.CostoEnvio,
                DireccionEntrega = direccionEntrega,
                DatosPagoMercadoPago = ultimoPago?.DatosMercadoPago == null
                    ? null
                    : new PedidoDTOs.DatosPagoMercadoPagoDTO
                    {
                        PaymentIdExterno = ultimoPago.DatosMercadoPago.PaymentIdExterno,
                        MetodoPagoId = ultimoPago.DatosMercadoPago.MetodoPagoId,
                        TipoPagoId = ultimoPago.DatosMercadoPago.TipoPagoId,
                        Cuotas = ultimoPago.DatosMercadoPago.Cuotas,
                        ValorCuota = ultimoPago.DatosMercadoPago.ValorCuota,
                        MontoTotalFinal = ultimoPago.DatosMercadoPago.MontoTotalFinal,
                        MontoPagado = ultimoPago.DatosMercadoPago.MontoPagado,
                        MontoNetoRecibido = ultimoPago.DatosMercadoPago.MontoNetoRecibido,
                        FechaAprobacionUtc = ultimoPago.DatosMercadoPago.FechaAprobacionUtc
                    },
                PagosMercadoPago = pagosAprobadosMp
                    .Where(p => p.DatosMercadoPago != null)
                    .Select(p => new PedidoDTOs.DatosPagoMercadoPagoDTO
                    {
                        PaymentIdExterno = p.DatosMercadoPago!.PaymentIdExterno,
                        MetodoPagoId = p.DatosMercadoPago.MetodoPagoId,
                        TipoPagoId = p.DatosMercadoPago.TipoPagoId,
                        Cuotas = p.DatosMercadoPago.Cuotas,
                        ValorCuota = p.DatosMercadoPago.ValorCuota,
                        MontoTotalFinal = p.DatosMercadoPago.MontoTotalFinal,
                        MontoPagado = p.DatosMercadoPago.MontoPagado,
                        MontoNetoRecibido = p.DatosMercadoPago.MontoNetoRecibido,
                        FechaAprobacionUtc = p.DatosMercadoPago.FechaAprobacionUtc
                    })
                    .ToList(),
                Lineas = pedido.Lineas.Select(l => new PedidoDTOs.LineaDetallePedidoClienteDTO
                {
                    Id = l.Id,
                    Marca = l.VariacionCelular?.Celular?.Marca ?? "",
                    Modelo = l.VariacionCelular?.Celular?.Modelo ?? "",
                    Color = l.VariacionCelular?.Color?.Nombre ?? "",
                    UrlImagen = l.VariacionCelular?.Imagenes
                        ?.OrderByDescending(i => i.EsPrincipal)
                        .Select(i => i.UrlImagen)
                        .FirstOrDefault() ?? "",
                    Cantidad = l.Cantidad,
                    PrecioUnitario = l.PrecioUnitario,
                    Subtotal = l.CalcularSubtotal()
                }).ToList()
            };
        }
    }
}
