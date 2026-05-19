using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Repositories
{
    public interface IPagoRepository
    {
        Task AgregarAsync(Pago pago);
        Task<Pago> ObtenerPorPedidoIdAsync(int pedidoId);
        Task<Pago?> ObtenerUltimoPorPedidoIdAsync(int pedidoId);
        Task<List<Pago>> ObtenerAprobadosPorPedidoIdAsync(int pedidoId);
        Task<decimal> ObtenerTotalAprobadoPorPedidoIdAsync(int pedidoId);
        Task<bool> ExistePagoMercadoPagoPorExternoAsync(int pedidoId, string paymentIdExterno);
        Task GuardarAsync();
    }
}
