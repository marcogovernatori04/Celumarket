using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Celumarket.Application.DTOs.ReportesDTOs;

namespace Celumarket.Application.Interfaces.Repositories
{
    public interface IReportesRepository
    {
        Task<IEnumerable<TopVentasDTO>> ObtenerTop5VendidosAsync();
        Task<IEnumerable<StockCriticoDTO>> ObtenerStockCriticoAsync(int umbral = 5);
        Task<IEnumerable<FacturacionDiariaDTO>> ObtenerFacturacionUlt30DiasAsync();
        Task<IEnumerable<FacturacionDiariaDTO>> ObtenerFacturacionPorMesAsync(int anio, int mes);
        Task<DashboardDTO> ObtenerReportesBasicosAsync();
    }
}
