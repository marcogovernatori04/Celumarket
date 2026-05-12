using Celumarket.API.Request_DTOs;
using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Celumarket.Application.DTOs.CatalogoDTOs;

namespace Celumarket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CelularesController : ControllerBase
    {
        private readonly IGestorCatalogo _gestorCatalogo;

        public CelularesController(IGestorCatalogo gestorCatalogo)
        {
            _gestorCatalogo = gestorCatalogo;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CrearCelular([FromBody] CatalogoDTOs.CrearCelularDTO dto)
        {
            int nuevoCelularId = await _gestorCatalogo.CrearCelularAsync(dto);
            return Ok(new { Mensaje = "Celular creado con éxito.", CelularId = nuevoCelularId });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> ModificarCelular([FromBody] CatalogoDTOs.ModificarCelularDTO dto)
        {
            await _gestorCatalogo.ModificarCelularAsync(dto);
            return Ok(new { Mensaje = "Celular modificado con éxito." });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarCelular(int id)
        {
            await _gestorCatalogo.EliminarCelularAsync(id);
            return Ok(new { Mensaje = "Celular eliminado con éxito." });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("variacion")]
        public async Task<IActionResult> AgregarVariacion([FromBody] CatalogoDTOs.AgregarVariacionDTO dto)
        {
            int nuevaVariacionId = await _gestorCatalogo.AgregarVariacionAsync(dto);
            return Ok(new { Mensaje = "Variación agregada con éxito.", VariacionId = nuevaVariacionId });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("variaciones/{variacionId}")]
        public async Task<IActionResult> ModificarVariacion(int variacionId, [FromBody] CatalogoDTOs.ModificarVariacionDTO dto)
        {
            dto.VariacionId = variacionId;
            await _gestorCatalogo.ModificarVariacionAsync(dto);
            return Ok(new { Mensaje = "Variación modificada con éxito." });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("variaciones/{variacionId}/imagenes")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> SubirImagen(int variacionId, [FromForm] SubirImagenDTO request)
        {
            if (request.Archivo == null || request.Archivo.Length == 0)
            {
                return BadRequest(new { error = "No se envió ningún archivo." });
            }

            using (var stream = request.Archivo.OpenReadStream())
            {
                string fileName = request.Archivo.FileName;

                var url = await _gestorCatalogo.AgregarImagenAsync(variacionId, stream, fileName, request.EsPrincipal);

                return Ok(new { url });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("variaciones/{variacionId}/imagenes")]
        public async Task<IActionResult> EliminarImagen(int variacionId, [FromQuery] string url)
        {
            await _gestorCatalogo.EliminarImagenAsync(variacionId, url);
            return Ok(new { Mensaje = "Imagen eliminada con éxito." });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/especificaciones")]
        public async Task<IActionResult> AgregarEspecificaciones(int id, [FromBody] List<EspecificacionDTO> dto)
        {
            await _gestorCatalogo.AgregarEspecificacionesAsync(id, dto);
            return Ok(new { Mensaje = "Especificaciones añadidas con éxito." });

        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/especificaciones")]
        public async Task<IActionResult> ReemplazarEspecificaciones(int id, [FromBody] List<EspecificacionDTO> dto)
        {
            await _gestorCatalogo.ReemplazarEspecificacionesAsync(id, dto);
            return Ok(new { Mensaje = "Especificaciones actualizadas con éxito." });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/destacado")]
        public async Task<IActionResult> ConfigurarDestacado(int id, [FromBody] ConfigurarDestacadoDTO dto)
        {
            await _gestorCatalogo.ConfigurarDestacadoAsync(id, dto);
            return Ok(new { Mensaje = "Configuración de destacado actualizada." });
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> ObtenerCatalogo([FromQuery] int pag = 1, [FromQuery] int cant = 10)
        {
            var celulares = await _gestorCatalogo.ListarCatalogoAsync(pag, cant);
            return Ok(celulares);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerDetalle(int id)
        {
            var celular = await _gestorCatalogo.ObtenerDetalleCelularAsync(id);
            return Ok(celular);
        }

        [AllowAnonymous]
        [HttpGet("destacados")]
        public async Task<IActionResult> ObtenerDestacados([FromQuery] int cantidad = 4)
        {
            var destacados = await _gestorCatalogo.ListarDestacadosAsync(cantidad);
            return Ok(destacados);
        }
    }
}
