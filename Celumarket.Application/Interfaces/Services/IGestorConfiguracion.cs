using Celumarket.Application.DTOs;

namespace Celumarket.Application.Interfaces.Services
{
    public interface IGestorConfiguracion
    {
        Task<ConfiguracionDTOs.ConfiguracionSistemaDTO> ObtenerAsync();
        Task<ConfiguracionDTOs.ConfiguracionSistemaDTO> ActualizarAsync(ConfiguracionDTOs.ActualizarConfiguracionSistemaDTO dto);
    }
}
