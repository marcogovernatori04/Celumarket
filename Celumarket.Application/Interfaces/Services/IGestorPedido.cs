using Celumarket.Application.DTOs;
using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Services
{
    public interface IGestorPedido
    {
        Task<int> GenerarPedidoAsync(int clienteId, int metodoPagoId, TipoEnvio tipoEnvio, List<CarritoDTOs.ItemCarritoDTO> items, Direccion? direccionEntregaOverride = null, bool stockYaBloqueado = false);
        Task ConfirmarPagoAsync(int pedidoId);
        Task CancelarPedidoAsync(int pedidoId);
    }
}
