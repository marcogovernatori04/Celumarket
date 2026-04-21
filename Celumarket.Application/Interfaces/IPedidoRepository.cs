using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces
{
    public interface IPedidoRepository
    {
        Task AgregarAsync(Pedido pedido);
        Task<Pedido> ObtenerPorIdAsync(int id);
        Task GuardarAsync();
        
    }
}
