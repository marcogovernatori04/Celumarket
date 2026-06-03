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
                    TextoBannerHero = "¡Bienvenido!",
                    AliasTransferencia = "celumarket",
                    CbuTransferencia = "0000003100000000000000",
                    TitularTransferencia = "Celumarket S.A.",
                    BancoTransferencia = "Banco Nación",
                    UrlImagenHero = null
                };
            }

            return new ConfiguracionDTOs.ConfiguracionSistemaDTO
            {
                DescuentoTransferencia = config.DescuentoTransferencia,
                UmbralEnvioGratis = config.UmbralEnvioGratis,
                TextoBannerHero = string.IsNullOrWhiteSpace(config.TextoBannerHero) ? "¡Bienvenido!" : config.TextoBannerHero,
                AliasTransferencia = config.AliasTransferencia,
                CbuTransferencia = config.CbuTransferencia,
                TitularTransferencia = config.TitularTransferencia,
                BancoTransferencia = config.BancoTransferencia,
                UrlImagenHero = config.UrlImagenHero
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
            if (string.IsNullOrWhiteSpace(dto.AliasTransferencia))
                throw new ArgumentException("El alias de transferencia es obligatorio.");
            if (string.IsNullOrWhiteSpace(dto.CbuTransferencia))
                throw new ArgumentException("El CBU de transferencia es obligatorio.");
            if (string.IsNullOrWhiteSpace(dto.TitularTransferencia))
                throw new ArgumentException("El titular de transferencia es obligatorio.");
            if (string.IsNullOrWhiteSpace(dto.BancoTransferencia))
                throw new ArgumentException("El banco de transferencia es obligatorio.");
            if (!string.IsNullOrWhiteSpace(dto.UrlImagenHero) &&
                !Uri.TryCreate(dto.UrlImagenHero, UriKind.Absolute, out _))
                throw new ArgumentException("La URL de la imagen del hero no es válida.");

            var config = await _configRepo.ObtenerConfigActualAsync();
            if (config == null)
                throw new InvalidOperationException("No se encontró una configuración del sistema activa.");

            config.Actualizar(dto.DescuentoTransferencia, dto.UmbralEnvioGratis);
            config.ActualizarTextoBannerHero(dto.TextoBannerHero);
            config.ActualizarDatosTransferencia(
                dto.AliasTransferencia,
                dto.CbuTransferencia,
                dto.TitularTransferencia,
                dto.BancoTransferencia);
            config.ActualizarImagenHero(dto.UrlImagenHero);

            await _unitOfWork.GuardarAsync();

            return Mapear(config);
        }

        public async Task<ConfiguracionDTOs.ConfiguracionSistemaDTO> ActualizarImagenHeroAsync(string? urlImagenHero)
        {
            if (!string.IsNullOrWhiteSpace(urlImagenHero) &&
                !Uri.TryCreate(urlImagenHero, UriKind.Absolute, out _))
                throw new ArgumentException("La URL de la imagen del hero no es válida.");

            var config = await _configRepo.ObtenerConfigActualAsync();
            if (config == null)
                throw new InvalidOperationException("No se encontró una configuración del sistema activa.");

            config.ActualizarImagenHero(urlImagenHero);
            await _unitOfWork.GuardarAsync();

            return Mapear(config);
        }

        private static ConfiguracionDTOs.ConfiguracionSistemaDTO Mapear(Domain.ConfiguracionSistema config)
        {
            return new ConfiguracionDTOs.ConfiguracionSistemaDTO
            {
                DescuentoTransferencia = config.DescuentoTransferencia,
                UmbralEnvioGratis = config.UmbralEnvioGratis,
                TextoBannerHero = string.IsNullOrWhiteSpace(config.TextoBannerHero) ? "¡Bienvenido!" : config.TextoBannerHero,
                AliasTransferencia = config.AliasTransferencia,
                CbuTransferencia = config.CbuTransferencia,
                TitularTransferencia = config.TitularTransferencia,
                BancoTransferencia = config.BancoTransferencia,
                UrlImagenHero = config.UrlImagenHero
            };
        }
    }
}
