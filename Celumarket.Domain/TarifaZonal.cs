using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Domain
{
    public class TarifaZonal
    {
        public int Id { get; private set; }
        public int CodigoPostal { get; private set; }
        public decimal PrecioDomicilio { get; private set; }
        public decimal PrecioSucursal { get; private set; }
        public int DiasDemora { get; private set; }
        public string SucursalCorreoCalle { get; private set; } = string.Empty;
        public string SucursalCorreoNumero { get; private set; } = string.Empty;
        public string SucursalCorreoPisoDepto { get; private set; } = string.Empty;
        public string SucursalCorreoLocalidad { get; private set; } = string.Empty;
        public string SucursalCorreoProvincia { get; private set; } = string.Empty;
        public int SucursalCorreoCodigoPostal { get; private set; }

        protected TarifaZonal() { }

        public TarifaZonal(
            int codigoPostal,
            decimal precioDomicilio,
            decimal precioSucursal,
            int diasDemora,
            string sucursalCorreoCalle = "",
            string sucursalCorreoNumero = "",
            string sucursalCorreoPisoDepto = "",
            string sucursalCorreoLocalidad = "",
            string sucursalCorreoProvincia = "",
            int? sucursalCorreoCodigoPostal = null)
        {
            if (codigoPostal <= 0) throw new ArgumentException("Código postal inválido.");
            if (precioDomicilio < 0 || precioSucursal < 0) throw new ArgumentException("Los precios de envío no pueden ser negativos.");
            if (diasDemora < 0) throw new ArgumentException("Los días de demora no pueden ser negativos.");

            CodigoPostal = codigoPostal;
            PrecioDomicilio = precioDomicilio;
            PrecioSucursal = precioSucursal;
            DiasDemora = diasDemora;
            SucursalCorreoCalle = sucursalCorreoCalle ?? string.Empty;
            SucursalCorreoNumero = sucursalCorreoNumero ?? string.Empty;
            SucursalCorreoPisoDepto = sucursalCorreoPisoDepto ?? string.Empty;
            SucursalCorreoLocalidad = sucursalCorreoLocalidad ?? string.Empty;
            SucursalCorreoProvincia = sucursalCorreoProvincia ?? string.Empty;
            SucursalCorreoCodigoPostal = sucursalCorreoCodigoPostal ?? codigoPostal;
        }

    }
}
