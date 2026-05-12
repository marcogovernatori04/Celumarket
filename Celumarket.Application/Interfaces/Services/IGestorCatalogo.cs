using Celumarket.Application.DTOs;
using static Celumarket.Application.DTOs.CatalogoDTOs;

namespace Celumarket.Application.Interfaces.Services
{
    public interface IGestorCatalogo
    {
        Task<int> CrearCelularAsync(CrearCelularDTO dto);
        Task ModificarCelularAsync(ModificarCelularDTO dto);
        Task EliminarCelularAsync(int id);
        Task<int> AgregarVariacionAsync(AgregarVariacionDTO dto);
        Task EliminarVariacionAsync(int variacionId);
        Task ModificarVariacionAsync(ModificarVariacionDTO dto);
        Task<string> AgregarImagenAsync(int variacionId, Stream fileStream, string fileName, bool esPrincipal);
        Task EliminarImagenAsync(int variacionId, string urlImagen);
        Task AgregarEspecificacionesAsync(int celularId, List<EspecificacionDTO> dto);
        Task ReemplazarEspecificacionesAsync(int celularId, List<EspecificacionDTO> dto);
        Task ConfigurarDestacadoAsync(int celularId, ConfigurarDestacadoDTO dto);
        Task<PaginacionDTO<CelularListadoDTO>> ListarCatalogoAsync(int pag, int cant);
        Task<List<CelularDestacadoDTO>> ListarDestacadosAsync(int cantidad = 4);
        Task<CelularDetalleDTO> ObtenerDetalleCelularAsync(int id);
    }
}
