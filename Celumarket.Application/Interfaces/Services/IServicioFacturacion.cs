using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Services
{
    public interface IServicioFacturacion
    {
        Task GenerarFacturaElectronicaAsync(Factura factura);
    }
}
