using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Domain
{
    public class ConfiguracionSistema
    {
        public int Id { get; private set; }
        public decimal DescuentoTransferencia { get; private set; }
        public decimal UmbralEnvioGratis { get; private set; }
        public string TextoBannerHero { get; private set; } = "¡Bienvenido!";

        protected ConfiguracionSistema() { }

        public ConfiguracionSistema(
            decimal descuentoTransferencia,
            decimal umbralEnvioGratis,
            string? textoBannerHero = null)
        {
            DescuentoTransferencia = descuentoTransferencia;
            UmbralEnvioGratis = umbralEnvioGratis;
            TextoBannerHero = string.IsNullOrWhiteSpace(textoBannerHero)
                ? "¡Bienvenido!"
                : textoBannerHero.Trim();
        }

        public void Actualizar(decimal nuevoDescuento, decimal nuevoUmbral)
        {
            DescuentoTransferencia = nuevoDescuento;
            UmbralEnvioGratis = nuevoUmbral;
        }

        public void ActualizarTextoBannerHero(string? nuevoTextoBannerHero)
        {
            TextoBannerHero = string.IsNullOrWhiteSpace(nuevoTextoBannerHero)
                ? "¡Bienvenido!"
                : nuevoTextoBannerHero.Trim();
        }

    }
}
