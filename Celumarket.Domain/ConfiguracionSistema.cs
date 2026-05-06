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

        protected ConfiguracionSistema() { }

        public ConfiguracionSistema(decimal descuentoTransferencia, decimal umbralEnvioGratis)
        {
            DescuentoTransferencia = descuentoTransferencia;
            UmbralEnvioGratis = umbralEnvioGratis;
        }

        public void Actualizar(decimal nuevoDescuento, decimal nuevoUmbral)
        {
            DescuentoTransferencia = nuevoDescuento;
            UmbralEnvioGratis = nuevoUmbral;
        }

    }
}
