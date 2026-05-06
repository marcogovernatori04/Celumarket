using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Repositories
{
    public interface IEnvioRepository
    {
        Task AgregarAsync(Envio envio);
        Task<Envio> ObtenerPorIdAsync(int id);
        Task<Envio?> ObtenerPorPedidoIdAsync(int pedidoId);
        Task<List<Envio>> ObtenerTodosAsync();
        Task GuardarAsync();
    }
}
