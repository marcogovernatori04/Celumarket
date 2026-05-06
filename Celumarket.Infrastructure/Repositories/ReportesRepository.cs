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
                .Where(v => v.StockDisponible <= umbral)
                .OrderBy(v => v.Stock)
                .Select(v => new StockCriticoDTO
                {
                    VariacionId = v.Id,
                    MarcaModelo = $"{v.Celular.Marca} {v.Celular.Modelo}",
                    Precio = v.Precio,
                    StockActual = v.StockDisponible
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<FacturacionDiariaDTO>> ObtenerFacturacionUlt30DiasAsync()
        {
            var fechaInicio = DateTime.Now.Date.AddDays(-30);

            return await _context.Pedidos
                .Where(p => p.Fecha >= fechaInicio && p.Estado == Pedido.EstadoPagado)
                .GroupBy(p => p.Fecha.Date)
                .Select(g => new FacturacionDiariaDTO
                {
                    Fecha = g.Key,
                    CantidadPedidos = g.Count(),
                    TotalFacturado = g.Sum(p => p.MontoTotal)
                })
                .OrderBy(x => x.Fecha)
                .ToListAsync();
        }

        public async Task<IEnumerable<FacturacionDiariaDTO>> ObtenerFacturacionPorMesAsync(int anio, int mes)
        {
            return await _context.Pedidos
                .Where(p => p.Estado == Pedido.EstadoPagado && p.Fecha.Year == anio && p.Fecha.Month == mes)
                .GroupBy(p => p.Fecha.Date)
                .Select(g => new FacturacionDiariaDTO
                {
                    Fecha = g.Key,
                    CantidadPedidos = g.Count(),
                    TotalFacturado = g.Sum(p => p.MontoTotal)
                })
                .OrderBy(x => x.Fecha)
                .ToListAsync();
        }

        public async Task<DashboardDTO> ObtenerReportesBasicosAsync()
        {
            var resumen = new DashboardDTO
            {
                TotalUsuarios = await _context.Usuarios.CountAsync(),
                PedidosPendientes = await _context.Pedidos.CountAsync(p => p.Estado == Pedido.EstadoPendienteDePago),
                ProductosSinStock = await _context.Variaciones.CountAsync(v => v.Stock == 0),
                TotalPedidos = await _context.Pedidos.CountAsync(),
                RecaudacionTotal = await _context.Pedidos.Where(p => p.Estado == Pedido.EstadoPagado).SumAsync(p => p.MontoTotal)
            };

            return resumen;
        }
    }
}
