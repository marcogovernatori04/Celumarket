using Celumarket.Application.DTOs;
using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Services
{
    public interface IGestorEnvio
    {
        Task<decimal> CalcularCostoEnvioAsync(int codigoPostal, decimal totalPedido, TipoEnvio tipoEnvio);
        Task ProgramarDespachoAsync(Pedido pedido, Cliente cliente, TipoEnvio tipoEnvio);
        Task DespacharEnvioAsync(int envioId, string numeroSeguimiento);
        Task MarcarComoEntregadoAsync(int envioId);
    }
}
