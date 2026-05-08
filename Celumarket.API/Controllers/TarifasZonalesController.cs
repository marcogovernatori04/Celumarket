using Celumarket.Application.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Celumarket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TarifasZonalesController : ControllerBase
    {
        private readonly ITarifaZonalRepository _tarifaRepo;

        public TarifasZonalesController(ITarifaZonalRepository tarifaRepo)
        {
            _tarifaRepo = tarifaRepo;
        }

        [AllowAnonymous]
        [HttpGet("{codigoPostal:int}")]
        public async Task<IActionResult> ObtenerPorCodigoPostal(int codigoPostal)
        {
            var tarifa = await _tarifaRepo.ObtenerTarifaPorCPAsync(codigoPostal);
            if (tarifa == null)
                return NotFound(new { Mensaje = "No se encontró tarifa para ese código postal." });

            return Ok(new
            {
                tarifa.CodigoPostal,
                tarifa.PrecioDomicilio,
                tarifa.PrecioSucursal,
                tarifa.DiasDemora,
                tarifa.SucursalCorreoCalle,
                tarifa.SucursalCorreoNumero,
                tarifa.SucursalCorreoPisoDepto,
                tarifa.SucursalCorreoLocalidad,
                tarifa.SucursalCorreoProvincia,
                tarifa.SucursalCorreoCodigoPostal
            });
        }
    }
}
