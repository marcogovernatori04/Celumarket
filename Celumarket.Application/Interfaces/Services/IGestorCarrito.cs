using Celumarket.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Services
{
    public interface IGestorCarrito
    {
        Task<CarritoDTOs.CarritoDetalleDTO> ObtenerCarritoClienteAsync(int clienteId);
        Task AgregarItemAsync(int clienteId, CarritoDTOs.AgregarItemDTO dto);
        Task EliminarItemAsync(int clienteId, int variacionId);
        Task RestarItemAsync(int clienteId, int variacionId, int cantidad = 1);
        Task VaciarCarritoAsync(int clienteId);
    }
}
