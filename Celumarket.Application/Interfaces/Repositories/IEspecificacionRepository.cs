using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Repositories
{
    public interface IEspecificacionRepository
    {
        Task AgregarRangoAsync(IEnumerable<Especificacion> especificaciones);
        Task<Especificacion> ObtenerPorIdAsync(int id);
        Task<List<Especificacion>> ObtenerPorCelularIdAsync(int celularId);
        void EliminarRango(IEnumerable<Especificacion> especificaciones);
    }
}
