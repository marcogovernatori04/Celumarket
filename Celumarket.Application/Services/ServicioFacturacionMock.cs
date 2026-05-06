using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Services
{
    public class ServicioFacturacionMock : IServicioFacturacion
    {
        public async Task GenerarFacturaElectronicaAsync(Factura factura)
        {
            await Task.Delay(500);

            string letra = factura.Tipo.ToString();
            string nro = $"{letra}-00001-{Random.Shared.Next(1000, 99999):D8}"; 
            string cae = Random.Shared.NextInt64(10000000000000, 99999999999999).ToString();
            DateTime vencimiento = DateTime.Now.AddDays(10);

            factura.RegistrarRespuestaARCA(nro, cae, vencimiento);  

        }

    }
}
