using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces
{
    public interface ICelularRepository
    {
        Task AgregarAsync(Celular celular);
        Task<Celular> ObtenerPorIdAsync(int id);
        void Eliminar(Celular celular); 
        Task GuardarAsync();
    }
}
