using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;

namespace Celumarket.Application.Services
{
    public class GestorConfiguracion : IGestorConfiguracion
    {
        private readonly IConfiguracionRepository _configRepo;
        private readonly IUnitOfWork _unitOfWork;

        public GestorConfiguracion(
            IConfiguracionRepository configRepo,
            IUnitOfWork unitOfWork)
        {
            _configRepo = configRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<ConfiguracionDTOs.ConfiguracionSistemaDTO> ObtenerAsync()
        {
            var config = await _configRepo.ObtenerConfigActualAsync();
            if (config == null)
            {
                return new ConfiguracionDTOs.ConfiguracionSistemaDTO
                {
                    DescuentoTransferencia = 10m,
                    UmbralEnvioGratis = 499999m,
                    TextoBannerHero = "¡Bienvenido!"
                };
            }

            return new ConfiguracionDTOs.ConfiguracionSistemaDTO
            {
                DescuentoTransferencia = config.DescuentoTransferencia,
                UmbralEnvioGratis = config.UmbralEnvioGratis,
                TextoBannerHero = string.IsNullOrWhiteSpace(config.TextoBannerHero) ? "¡Bienvenido!" : config.TextoBannerHero
            };
        }

        public async Task<ConfiguracionDTOs.ConfiguracionSistemaDTO> ActualizarAsync(ConfiguracionDTOs.ActualizarConfiguracionSistemaDTO dto)
        {
            if (dto.UmbralEnvioGratis < 0)
                throw new ArgumentException("El umbral de envío gratis no puede ser negativo.");

            if (dto.DescuentoTransferencia < 0)
                throw new ArgumentException("El descuento por transferencia no puede ser negativo.");

            if (dto.DescuentoTransferencia > 100)
                throw new ArgumentException("El descuento por transferencia no puede superar el 100%.");

            var config = await _configRepo.ObtenerConfigActualAsync();
            if (config == null)
                throw new InvalidOperationException("No se encontró una configuración del sistema activa.");

            config.Actualizar(dto.DescuentoTransferencia, dto.UmbralEnvioGratis);
            config.ActualizarTextoBannerHero(dto.TextoBannerHero);

            await _unitOfWork.GuardarAsync();

            return new ConfiguracionDTOs.ConfiguracionSistemaDTO
            {
                DescuentoTransferencia = config.DescuentoTransferencia,
                UmbralEnvioGratis = config.UmbralEnvioGratis,
                TextoBannerHero = string.IsNullOrWhiteSpace(config.TextoBannerHero) ? "¡Bienvenido!" : config.TextoBannerHero
            };
        }
    }
}
