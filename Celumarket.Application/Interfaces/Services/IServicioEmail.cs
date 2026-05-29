using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Services
{
    public interface IServicioEmail
    {
        Task EnviarEmailPedidoAsync(Pedido pedido, Cliente cliente, string metodoPago, string nroFactura = null);
        Task EnviarTokenRecuperacionClaveAsync(string emailDestino, string nombreDestino, string tokenRecuperacion);
    }
}
