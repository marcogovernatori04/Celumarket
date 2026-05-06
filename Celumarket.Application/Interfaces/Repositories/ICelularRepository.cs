using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Repositories
{
    public interface ICelularRepository
    {
        Task AgregarAsync(Celular celular);
        Task<Celular> ObtenerPorIdAsync(int id);
        Task<(IEnumerable<Celular> celulares, int total)> ObtenerTodosAsync(int pagina, int cantPorPagina);
        Task<List<Celular>> ObtenerDestacadosAsync(int cantidad);
        Task<Celular> ObtenerDetalleAsync(int id);
        void Eliminar(Celular celular); 
        Task GuardarAsync();
    }
}
