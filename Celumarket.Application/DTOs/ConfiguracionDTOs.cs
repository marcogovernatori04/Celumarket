namespace Celumarket.Application.DTOs
{
    public static class ConfiguracionDTOs
    {
        public class ConfiguracionSistemaDTO
        {
            public decimal DescuentoTransferencia { get; set; }
            public decimal UmbralEnvioGratis { get; set; }
            public string TextoBannerHero { get; set; } = "¡Bienvenido!";
        }

        public class ActualizarConfiguracionSistemaDTO
        {
            public decimal DescuentoTransferencia { get; set; }
            public decimal UmbralEnvioGratis { get; set; }
            public string TextoBannerHero { get; set; } = "¡Bienvenido!";
        }
    }
}
