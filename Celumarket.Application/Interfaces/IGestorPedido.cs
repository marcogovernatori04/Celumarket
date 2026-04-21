using Celumarket.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces
{
    public interface IGestorPedido
    {
        Task<int> GenerarPedidoAsync(int clienteId, int metodoPagoId, List<ItemCarritoDTO> items);
        Task ConfirmarPagoAsync(int pedidoId);
        Task CancelarPedidoAsync(int pedidoId);
    }
}
