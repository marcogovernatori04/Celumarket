using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces
{
    public interface IGestorStock
    {
        Task IngresarMercaderiaAsync(int variacionId, int cantidad);
        Task RegistrarPerdidaAsync(int variacionId, int cantidad);

    }
}
