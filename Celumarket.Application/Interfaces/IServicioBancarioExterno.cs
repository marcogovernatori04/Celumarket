using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces
{
    public interface IServicioBancarioExterno
    {
        Task<bool> AutorizarTransaccionAsync(string numeroTarjeta, decimal monto);
    }
}
