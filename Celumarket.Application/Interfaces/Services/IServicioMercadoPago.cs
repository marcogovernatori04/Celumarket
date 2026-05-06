using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Services
{
    public interface IServicioMercadoPago
    {
        Task<string> GenerarLinkDePagoAsync(Pedido pedido);
    }
}
