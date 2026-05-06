using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Repositories
{
    public interface IPedidoRepository
    {
        Task AgregarAsync(Pedido pedido);
        Task<Pedido> ObtenerPorIdAsync(int id);
        Task<List<Pedido>> ObtenerTodosAsync();
        Task<List<Pedido>> ObtenerPedidosPorClienteAsync(int clienteId);
        Task<List<Pedido>> ObtenerPendientesVencidosAsync(DateTime fechaUtcActual);
        Task GuardarAsync();
        
    }
}
