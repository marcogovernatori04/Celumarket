using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Domain;
using Microsoft.EntityFrameworkCore;
using static Celumarket.Application.DTOs.ReportesDTOs;

namespace Celumarket.Infrastructure.Repositories
{
    public class ReportesRepository : IReportesRepository
    {
        private readonly CelumarketContext _context;

        public ReportesRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TopVentasDTO>> ObtenerTop5VendidosAsync()
        {
            return await _context.Pedidos
                .Where(p => p.Estado == Pedido.EstadoPagado)
                .SelectMany(p => p.Lineas)
                .GroupBy(lp => new { lp.VariacionCelular.Celular.Marca, lp.VariacionCelular.Celular.Modelo })
                .Select(g => new TopVentasDTO
                {
                    Marca = g.Key.Marca,
                    Modelo = g.Key.Modelo,
                    CantidadVendida = g.Sum(lp => lp.Cantidad),
                    TotalRecaudado = g.Sum(lp => lp.PrecioUnitario * lp.Cantidad)
                })
                .OrderByDescending(x => x.CantidadVendida)
                .Take(5)
                .ToListAsync();
        }

        public async Task<IEnumerable<StockCriticoDTO>> ObtenerStockCriticoAsync(int umbral = 5)
        {
            return await _context.Variaciones
                .Include(v => v.Celular)
                .Where(v => (v.Stock - v.StockBloqueado) <= umbral)
                .OrderBy(v => v.Stock)
                .Select(v => new StockCriticoDTO
                {
                    VariacionId = v.Id,
                    MarcaModelo = $"{v.Celular.Marca} {v.Celular.Modelo}",
                    Precio = v.Precio,
                    StockActual = v.Stock - v.StockBloqueado
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<FacturacionDiariaDTO>> ObtenerFacturacionUlt30DiasAsync()
        {
            var fechaInicio = DateTime.Now.Date.AddDays(-30);
            var pedidos = await _context.Pedidos
                .Where(p => p.Fecha >= fechaInicio && p.Estado == Pedido.EstadoPagado)
                .Select(p => new
                {
                    p.Id,
                    p.Fecha,
                    p.DescuentoAplicado,
                    p.CostoEnvio
                })
                .ToListAsync();

            if (pedidos.Count == 0)
                return Enumerable.Empty<FacturacionDiariaDTO>();

            var pedidoIds = pedidos.Select(p => p.Id).ToList();

            var subtotalesPorPedido = await _context.LineasPedido
                .Where(l => pedidoIds.Contains(l.PedidoId))
                .GroupBy(l => l.PedidoId)
                .Select(g => new
                {
                    PedidoId = g.Key,
                    Subtotal = g.Sum(x => x.PrecioUnitario * x.Cantidad)
                })
                .ToDictionaryAsync(x => x.PedidoId, x => x.Subtotal);

            return pedidos
                .Select(p =>
                {
                    var subtotal = subtotalesPorPedido.TryGetValue(p.Id, out var s) ? s : 0m;
                    return new
                    {
                        Fecha = p.Fecha.Date,
                        TotalPedido = subtotal - p.DescuentoAplicado + p.CostoEnvio
                    };
                })
                .GroupBy(x => x.Fecha)
                .Select(g => new FacturacionDiariaDTO
                {
                    Fecha = g.Key,
                    CantidadPedidos = g.Count(),
                    TotalFacturado = g.Sum(x => x.TotalPedido)
                })
                .OrderBy(x => x.Fecha)
                .ToList();
        }

        public async Task<IEnumerable<FacturacionDiariaDTO>> ObtenerFacturacionPorMesAsync(int anio, int mes)
        {
            var pedidos = await _context.Pedidos
                .Where(p => p.Estado == Pedido.EstadoPagado && p.Fecha.Year == anio && p.Fecha.Month == mes)
                .Select(p => new
                {
                    p.Id,
                    p.Fecha,
                    p.DescuentoAplicado,
                    p.CostoEnvio
                })
                .ToListAsync();

            if (pedidos.Count == 0)
                return Enumerable.Empty<FacturacionDiariaDTO>();

            var pedidoIds = pedidos.Select(p => p.Id).ToList();

            var subtotalesPorPedido = await _context.LineasPedido
                .Where(l => pedidoIds.Contains(l.PedidoId))
                .GroupBy(l => l.PedidoId)
                .Select(g => new
                {
                    PedidoId = g.Key,
                    Subtotal = g.Sum(x => x.PrecioUnitario * x.Cantidad)
                })
                .ToDictionaryAsync(x => x.PedidoId, x => x.Subtotal);

            return pedidos
                .Select(p =>
                {
                    var subtotal = subtotalesPorPedido.TryGetValue(p.Id, out var s) ? s : 0m;
                    return new
                    {
                        Fecha = p.Fecha.Date,
                        TotalPedido = subtotal - p.DescuentoAplicado + p.CostoEnvio
                    };
                })
                .GroupBy(x => x.Fecha)
                .Select(g => new FacturacionDiariaDTO
                {
                    Fecha = g.Key,
                    CantidadPedidos = g.Count(),
                    TotalFacturado = g.Sum(x => x.TotalPedido)
                })
                .OrderBy(x => x.Fecha)
                .ToList();
        }

        public async Task<DashboardDTO> ObtenerReportesBasicosAsync()
        {
            var pedidosPagados = await _context.Pedidos
                .Where(p => p.Estado == Pedido.EstadoPagado)
                .Select(p => new
                {
                    p.Id,
                    p.DescuentoAplicado,
                    p.CostoEnvio
                })
                .ToListAsync();

            decimal recaudacionTotal = 0m;
            if (pedidosPagados.Count > 0)
            {
                var pedidoIds = pedidosPagados.Select(p => p.Id).ToList();
                var subtotalesPorPedido = await _context.LineasPedido
                    .Where(l => pedidoIds.Contains(l.PedidoId))
                    .GroupBy(l => l.PedidoId)
                    .Select(g => new
                    {
                        PedidoId = g.Key,
                        Subtotal = g.Sum(x => x.PrecioUnitario * x.Cantidad)
                    })
                    .ToDictionaryAsync(x => x.PedidoId, x => x.Subtotal);

                recaudacionTotal = pedidosPagados.Sum(p =>
                {
                    var subtotal = subtotalesPorPedido.TryGetValue(p.Id, out var s) ? s : 0m;
                    return subtotal - p.DescuentoAplicado + p.CostoEnvio;
                });
            }

            var resumen = new DashboardDTO
            {
                TotalClientes = await _context.Clientes.CountAsync(),
                PedidosPendientes = await _context.Pedidos.CountAsync(p => p.Estado == Pedido.EstadoPendienteDePago),
                ProductosSinStock = await _context.Variaciones.CountAsync(v => v.Stock == 0),
                TotalPedidos = await _context.Pedidos.CountAsync(),
                RecaudacionTotal = recaudacionTotal
            };

            return resumen;
        }
    }
}
