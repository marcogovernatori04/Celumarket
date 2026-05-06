using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Services
{
    public class GestorPromociones : IGestorPromociones
    {
        private readonly IConfiguracionRepository _configRepo;

        public GestorPromociones(IConfiguracionRepository configRepo)
        {
            _configRepo = configRepo;
        }

        public async Task<decimal> AplicarDescuentoPorTransferenciaAsync(decimal montoOriginal, bool esTransferencia)
        {
            if (!esTransferencia)
                return montoOriginal;

            var config = await _configRepo.ObtenerConfigActualAsync();
            if (config == null)
                return montoOriginal;

            decimal descuento = NormalizarPorcentaje(config.DescuentoTransferencia);
            return montoOriginal * (1 - descuento);

        }

        public async Task<decimal> CalcularCostoEnvioBonificadoAsync(decimal costoOriginal, decimal totalPedido)
        {
            var config = await _configRepo.ObtenerConfigActualAsync();
            if (config == null)
                return costoOriginal;

            if (totalPedido >= config.UmbralEnvioGratis)
                return 0;

            return costoOriginal;
        }

        private static decimal NormalizarPorcentaje(decimal valor)
        {
            if (valor < 0)
                throw new ArgumentException("El descuento por transferencia no puede ser negativo.");

            if (valor > 1m && valor <= 100m)
                return valor / 100m;

            if (valor > 100m)
                throw new ArgumentException("El descuento por transferencia no puede superar el 100%.");

            return valor;
        }

    }
}
