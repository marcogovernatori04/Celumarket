using Celumarket.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces
{
    public interface IGestorPago
    {
        Task GenerarPagoPendienteAsync(PagoDTOs.GenerarPagoPendienteDTO dto);
        Task ProcesarRespuestaPasarelaAsync(PagoDTOs.RespuestaPasarelaDTO dto);
        Task RegistrarPagoManualAsync(PagoDTOs.RegistrarPagoManualDTO dto);

    }
}
