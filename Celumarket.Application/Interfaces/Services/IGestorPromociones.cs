using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Services
{
    public interface IGestorPromociones
    {
        Task<decimal> AplicarDescuentoPorTransferenciaAsync(decimal montoOriginal, bool esTransferencia);
        Task<decimal> CalcularCostoEnvioBonificadoAsync(decimal costoOriginal, decimal totalPedido);
    }
}
