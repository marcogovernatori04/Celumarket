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
        private readonly IPedidoRepository _pedidoRepo;
        private readonly IGestorEnvio _gestorEnvio;

        public EnviosController(IEnvioRepository envioRepo, IPedidoRepository pedidoRepo, IGestorEnvio gestorEnvio)
        {
            _envioRepo = envioRepo;
            _pedidoRepo = pedidoRepo;
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
            var envio = await _envioRepo.ObtenerPorIdAsync(envioId);
            if (envio == null)
                return NotFound(new { error = "Envío no encontrado." });

            var pedido = await _pedidoRepo.ObtenerPorIdAsync(envio.PedidoId);
            if (pedido == null)
                return NotFound(new { error = "Pedido no encontrado para el envío." });

            if (pedido.EstadoPedido != Domain.EstadoPedido.Pagado)
                return BadRequest(new { error = "Solo se pueden despachar envíos de pedidos pagados." });

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
