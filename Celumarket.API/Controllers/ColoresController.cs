using Celumarket.Application.Interfaces;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Celumarket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColoresController : ControllerBase
    {
        private readonly IColorRepository _colorRepo;
        private readonly IUnitOfWork _unitOfWork;

        public ColoresController(IColorRepository colorRepo, IUnitOfWork unitOfWork)
        {
            _colorRepo = colorRepo;
            _unitOfWork = unitOfWork;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> ListarActivos()
        {
            var colores = await _colorRepo.ObtenerActivosAsync();
            return Ok(colores.Select(c => new ColorListadoDto(c.Id, c.Nombre, c.Hex)));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] CrearColorDto dto)
        {
            var existente = await _colorRepo.ObtenerPorNombreAsync(dto.Nombre);
            if (existente != null)
                return Conflict(new { mensaje = "Ya existe un color con ese nombre." });

            var color = new Color(dto.Nombre, dto.Hex);
            await _colorRepo.AgregarAsync(color);
            await _unitOfWork.GuardarAsync();

            return Ok(new { mensaje = "Color creado con éxito.", colorId = color.Id });
        }

        public record ColorListadoDto(int Id, string Nombre, string Hex);
        public record CrearColorDto(string Nombre, string Hex);
    }
}
