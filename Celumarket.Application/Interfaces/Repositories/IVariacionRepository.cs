using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Repositories
{
    public interface IVariacionRepository
    {
        Task<VariacionCelular> ObtenerPorIdAsync(int id);
        Task GuardarAsync();
    }
}
