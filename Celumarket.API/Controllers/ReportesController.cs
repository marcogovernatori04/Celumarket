using Celumarket.Application.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Celumarket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportesController : ControllerBase
    {
        private readonly IReportesRepository _reportesRepo;

        public ReportesController(IReportesRepository reportesRepo)
        {
            _reportesRepo = reportesRepo;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("top-vendidos")]
        public async Task<IActionResult> ObtenerTopVendidos()
        {
            var reporte = await _reportesRepo.ObtenerTop5VendidosAsync();
            return Ok(reporte);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("stock-critico")]
        public async Task<IActionResult> ObtenerStockCritico([FromQuery] int umbral = 5)
        {
            var reporte = await _reportesRepo.ObtenerStockCriticoAsync(umbral);
            return Ok(reporte);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("facturacion-30d")]
        public async Task<IActionResult> ObtenerFacturacion30D()
        {
            var reporte = await _reportesRepo.ObtenerFacturacionUlt30DiasAsync();
            return Ok(reporte);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("facturacion-mes")]
        public async Task<IActionResult> ObtenerFacturacionPorMes(int anio, int mes)
        {
            if (mes < 1 || mes > 12)
            {
                return BadRequest("El mes debe ser un valor entre 1 y 12.");
            }
            if (anio < 2025)
            {
                return BadRequest("Año no válido.");
            }
            var reporte = await _reportesRepo.ObtenerFacturacionPorMesAsync(anio, mes);
            return Ok(reporte);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("dashboard")]
        public async Task<IActionResult> ObtenerReportesBasicos()
        {
            var resumen = await _reportesRepo.ObtenerReportesBasicosAsync();
            return Ok(resumen);
        }

    }
}
