using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Celumarket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class EnviosController : ControllerBase
    {
        private readonly IEnvioRepository _envioRepo;
        private readonly IGestorEnvio _gestorEnvio;

        public EnviosController(IEnvioRepository envioRepo, IGestorEnvio gestorEnvio)
        {
            _envioRepo = envioRepo;
            _gestorEnvio = gestorEnvio;
        }

        [HttpGet]
        public async Task<IActionResult> ListarEnvios()
        {
            var envios = await _envioRepo.ObtenerTodosAsync();

            var resultado = envios.Select(envio => new EnvioDTOs.EnvioListadoDTO
            {
                EnvioId = envio.Id,
                PedidoId = envio.PedidoId,
                Estado = envio.Estado.ToString(),
                Tipo = envio.Tipo.ToString(),
                Costo = envio.Costo,
                DireccionEntrega = $"{envio.DireccionEntrega.Calle} {envio.DireccionEntrega.Numero}, {envio.DireccionEntrega.Localidad}, {envio.DireccionEntrega.Provincia} ({envio.DireccionEntrega.CodigoPostal})",
                FechaEstimada = envio.FechaEstimada,
                FechaDespacho = envio.FechaDespacho,
                CodigoSeguimiento = envio.CodigoSeguimiento ?? string.Empty
            });

            return Ok(resultado);
        }

        [HttpPut("{envioId}/despachar")]
        public async Task<IActionResult> Despachar(int envioId, [FromBody] EnvioDTOs.DespacharEnvioDTO dto)
        {
            await _gestorEnvio.DespacharEnvioAsync(envioId, dto.NumeroSeguimiento);
            return Ok(new { Mensaje = "Envío despachado con éxito." });
        }

        [HttpPut("{envioId}/entregar")]
        public async Task<IActionResult> Entregar(int envioId)
        {
            await _gestorEnvio.MarcarComoEntregadoAsync(envioId);
            return Ok(new { Mensaje = "Envío marcado como entregado." });
        }
    }
}
