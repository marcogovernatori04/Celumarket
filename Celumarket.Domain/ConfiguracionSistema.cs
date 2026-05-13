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
        public string AliasTransferencia { get; private set; } = "celumarket";
        public string CbuTransferencia { get; private set; } = "0000003100000000000000";
        public string TitularTransferencia { get; private set; } = "Celumarket S.A.";
        public string BancoTransferencia { get; private set; } = "Banco Nación";

        protected ConfiguracionSistema() { }

        public ConfiguracionSistema(
            decimal descuentoTransferencia,
            decimal umbralEnvioGratis,
            string? textoBannerHero = null,
            string? aliasTransferencia = null,
            string? cbuTransferencia = null,
            string? titularTransferencia = null,
            string? bancoTransferencia = null)
        {
            DescuentoTransferencia = descuentoTransferencia;
            UmbralEnvioGratis = umbralEnvioGratis;
            TextoBannerHero = string.IsNullOrWhiteSpace(textoBannerHero)
                ? "¡Bienvenido!"
                : textoBannerHero.Trim();
            AliasTransferencia = string.IsNullOrWhiteSpace(aliasTransferencia)
                ? "celumarket"
                : aliasTransferencia.Trim();
            CbuTransferencia = string.IsNullOrWhiteSpace(cbuTransferencia)
                ? "0000003100000000000000"
                : cbuTransferencia.Trim();
            TitularTransferencia = string.IsNullOrWhiteSpace(titularTransferencia)
                ? "Celumarket S.A."
                : titularTransferencia.Trim();
            BancoTransferencia = string.IsNullOrWhiteSpace(bancoTransferencia)
                ? "Banco Nación"
                : bancoTransferencia.Trim();
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

        public void ActualizarDatosTransferencia(
            string? aliasTransferencia,
            string? cbuTransferencia,
            string? titularTransferencia,
            string? bancoTransferencia)
        {
            AliasTransferencia = string.IsNullOrWhiteSpace(aliasTransferencia)
                ? "celumarket"
                : aliasTransferencia.Trim();
            CbuTransferencia = string.IsNullOrWhiteSpace(cbuTransferencia)
                ? "0000003100000000000000"
                : cbuTransferencia.Trim();
            TitularTransferencia = string.IsNullOrWhiteSpace(titularTransferencia)
                ? "Celumarket S.A."
                : titularTransferencia.Trim();
            BancoTransferencia = string.IsNullOrWhiteSpace(bancoTransferencia)
                ? "Banco Nación"
                : bancoTransferencia.Trim();
        }

    }
}
