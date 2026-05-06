using Celumarket.Application.Interfaces;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;
using System;
using System.Threading.Tasks;

namespace Celumarket.Application.Services
{
    public class GestorEnvio : IGestorEnvio
    {
        private readonly IEnvioRepository _envioRepo;
        private readonly ITarifaZonalRepository _tarifaRepo;
        private readonly IGestorPromociones _gestorPromociones;
        private readonly IUnitOfWork _unitOfWork;

        public GestorEnvio(
            IEnvioRepository envioRepo,
            ITarifaZonalRepository tarifaRepo,
            IGestorPromociones gestorPromociones,
            IUnitOfWork unitOfWork)
        {
            _envioRepo = envioRepo;
            _tarifaRepo = tarifaRepo;
            _gestorPromociones = gestorPromociones;
            _unitOfWork = unitOfWork;
        }

        public async Task<decimal> CalcularCostoEnvioAsync(int codigoPostal, decimal totalPedido, TipoEnvio tipoEnvio)
        {
            if (tipoEnvio == TipoEnvio.Local)
                return 0m;

            var tarifa = await _tarifaRepo.ObtenerTarifaPorCPAsync(codigoPostal);
            if (tarifa == null)
                throw new Exception($"No se realizan envíos al código postal {codigoPostal}.");

            decimal costoEnvioBase = tipoEnvio == TipoEnvio.Domicilio
                                        ? tarifa.PrecioDomicilio
                                        : tarifa.PrecioSucursal;

            return await _gestorPromociones.CalcularCostoEnvioBonificadoAsync(costoEnvioBase, totalPedido);
        }

        public async Task ProgramarDespachoAsync(Pedido pedido, Cliente cliente, TipoEnvio tipoEnvio)
        {
            if (tipoEnvio == TipoEnvio.Local)
                return;

            var codigoPostal = cliente.Direccion.CodigoPostal;

            var tarifa = await _tarifaRepo.ObtenerTarifaPorCPAsync(codigoPostal);
            if (tarifa == null)
                throw new Exception($"No se realizan envíos al código postal {codigoPostal}.");

            DateTime fechaEstimada = DateTime.UtcNow.AddDays(tarifa.DiasDemora);

            var envio = new Envio(pedido.Id, cliente.Direccion, pedido.CostoEnvio, fechaEstimada, tipoEnvio);

            await _envioRepo.AgregarAsync(envio);
        }

        public async Task DespacharEnvioAsync(int envioId, string numeroSeguimiento)
        {
            var envio = await _envioRepo.ObtenerPorIdAsync(envioId);
            if (envio == null)
                throw new Exception("Envío no encontrado.");
            if (string.IsNullOrWhiteSpace(numeroSeguimiento))
                throw new Exception("Número de seguimiento es requerido.");

            envio.Despachar(numeroSeguimiento);
            await _unitOfWork.GuardarAsync();
        }

        public async Task MarcarComoEntregadoAsync(int envioId)
        {
            var envio = await _envioRepo.ObtenerPorIdAsync(envioId);
            if (envio == null)
                throw new Exception("Envío no encontrado.");

            envio.Entregar();
            await _unitOfWork.GuardarAsync();
        }
    }
}