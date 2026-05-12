using Celumarket.Application.Interfaces.Services;
using Celumarket.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Celumarket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfiguracionController : ControllerBase
    {
        private readonly IGestorConfiguracion _gestorConfiguracion;

        public ConfiguracionController(IGestorConfiguracion gestorConfiguracion)
        {
            _gestorConfiguracion = gestorConfiguracion;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Obtener()
        {
            var config = await _gestorConfiguracion.ObtenerAsync();
            return Ok(config);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> Actualizar([FromBody] ConfiguracionDTOs.ActualizarConfiguracionSistemaDTO dto)
        {
            var actualizado = await _gestorConfiguracion.ActualizarAsync(dto);
            return Ok(actualizado);
        }
    }
}
