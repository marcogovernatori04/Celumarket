using Celumarket.Application.Interfaces;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;
using System;
using System.Threading.Tasks;

namespace Celumarket.Application.Services
{
    public class GestorFacturacion : IGestorFacturacion
    {
        private readonly IFacturaRepository _facturaRepo;
        private readonly IServicioFacturacion _servicioFacturacion;

        public GestorFacturacion(
            IFacturaRepository facturaRepo,
            IServicioFacturacion servicioFacturacion)
        {
            _facturaRepo = facturaRepo;
            _servicioFacturacion = servicioFacturacion;
        }

        public async Task<Factura> GenerarFacturaAsync(Pedido pedido, Cliente cliente)
        {
            string nombreCompleto = $"{cliente.Nombre} {cliente.Apellido}";

            var factura = new Factura(pedido.Id, pedido.MontoTotal, TipoFactura.B, nombreCompleto, cliente.Dni);

            await _servicioFacturacion.GenerarFacturaElectronicaAsync(factura);
            await _facturaRepo.AgregarAsync(factura);

            return factura;
        }
    }
}