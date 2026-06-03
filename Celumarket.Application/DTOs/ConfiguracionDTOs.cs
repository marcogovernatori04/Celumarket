namespace Celumarket.Application.DTOs
{
    public static class ConfiguracionDTOs
    {
        public class ConfiguracionSistemaDTO
        {
            public decimal DescuentoTransferencia { get; set; }
            public decimal UmbralEnvioGratis { get; set; }
            public string TextoBannerHero { get; set; } = "¡Bienvenido!";
            public string AliasTransferencia { get; set; } = "celumarket";
            public string CbuTransferencia { get; set; } = "0000003100000000000000";
            public string TitularTransferencia { get; set; } = "Celumarket S.A.";
            public string BancoTransferencia { get; set; } = "Banco Nación";
            public string? UrlImagenHero { get; set; }
        }

        public class ActualizarConfiguracionSistemaDTO
        {
            public decimal DescuentoTransferencia { get; set; }
            public decimal UmbralEnvioGratis { get; set; }
            public string TextoBannerHero { get; set; } = "¡Bienvenido!";
            public string AliasTransferencia { get; set; } = "celumarket";
            public string CbuTransferencia { get; set; } = "0000003100000000000000";
            public string TitularTransferencia { get; set; } = "Celumarket S.A.";
            public string BancoTransferencia { get; set; } = "Banco Nación";
            public string? UrlImagenHero { get; set; }
        }
    }
}
