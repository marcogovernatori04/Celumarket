using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Repositories
{
    public interface ITarifaZonalRepository
    {
        Task<TarifaZonal> ObtenerTarifaPorCPAsync(int codigoPostal);
    }
}
