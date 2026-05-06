using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Celumarket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class StockController : ControllerBase
    {
        private readonly IGestorStock _gestorStock;

        public StockController(IGestorStock gestorStock)
        {
            _gestorStock = gestorStock;
        }

        [HttpPost("ingreso")]
        public async Task<IActionResult> IngresarMercaderia([FromBody] StockDTOs.AjustarStockDTO dto)
        {
            try
            {
                await _gestorStock.IngresarMercaderiaAsync(dto.VariacionId, dto.Cantidad);
                return Ok(new { Mensaje = "Stock ingresado con éxito." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("perdida")]
        public async Task<IActionResult> RegistrarPerdida([FromBody] StockDTOs.AjustarStockDTO dto)
        {
            try
            {
                await _gestorStock.RegistrarPerdidaAsync(dto.VariacionId, dto.Cantidad);
                return Ok(new { Mensaje = "Pérdida de stock registrada con éxito." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
