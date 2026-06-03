using Celumarket.Application.Interfaces.Services;
using Celumarket.Application.DTOs;
using Celumarket.API.Request_DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Celumarket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfiguracionController : ControllerBase
    {
        private readonly IGestorConfiguracion _gestorConfiguracion;
        private readonly IServicioImagen _servicioImagen;

        public ConfiguracionController(IGestorConfiguracion gestorConfiguracion, IServicioImagen servicioImagen)
        {
            _gestorConfiguracion = gestorConfiguracion;
            _servicioImagen = servicioImagen;
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

        [Authorize(Roles = "Admin")]
        [HttpPost("hero-imagen")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> SubirImagenHero([FromForm] SubirImagenHeroDTO request)
        {
            if (request.Archivo == null || request.Archivo.Length == 0)
                return BadRequest(new { error = "Debe seleccionar una imagen." });

            await using var stream = request.Archivo.OpenReadStream();
            var url = await _servicioImagen.SubirImagenAsync(stream, request.Archivo.FileName);
            var actualizado = await _gestorConfiguracion.ActualizarImagenHeroAsync(url);

            return Ok(actualizado);
        }
    }
}
