using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.DTOs
{
    public class CatalogoDTOs
    {
        public class PaginacionDTO<T>
        {
            public List<T> Items { get; set; } = new List<T>();
            public int TotalItems { get; set; }
            public int PaginaActual { get; set; }
            public int TotalPaginas { get; set; }
        }

        public class CelularListadoDTO
        {
            public int Id { get; set; }
            public string Marca { get; set; }
            public string Modelo { get; set; }
            public decimal PrecioMinimo { get; set; }
            public int CantidadColores { get; set; }
            public string UrlImagenPrincipal { get; set; }
        }

        public class CelularDetalleDTO
        {
            public int Id { get; set; }
            public string Marca { get; set; }
            public string Modelo { get; set; }
            public string Descripcion { get; set; }
            public List<EspecificacionDTO> Especificaciones { get; set; } = new List<EspecificacionDTO>();
            public List<VariacionDetalleDTO> Variaciones { get; set; } = new List<VariacionDetalleDTO>();
        }

        public class VariacionDetalleDTO
        {
            public int Id { get; set; }
            public string Color { get; set; }
            public int ColorId { get; set; }
            public string? ColorHex { get; set; }
            public decimal Precio { get; set; }
            public decimal? PrecioAnterior { get; set; }
            public string Almacenamiento { get; set; }
            public int Stock { get; set; }
            public List<string> Imagenes { get; set; } = new List<string>();
        }

        public class CrearCelularDTO
        {
            public string Marca { get; set; }
            public string Modelo { get; set; }
            public string Descripcion { get; set; }
        }

        public class AgregarVariacionDTO
        {
            public int CelularId { get; set; }
            public int ColorId { get; set; }
            public decimal Precio { get; set; }
            public decimal? PrecioAnterior { get; set; }
            public string Almacenamiento { get; set; }
            public int StockInicial { get; set; }
        }

        public class ConfigurarDestacadoDTO
        {
            public bool EsDestacado { get; set; }
            public string? TextoPromocion { get; set; }
        }

        public class CelularDestacadoDTO
        {
            public int Id { get; set; }
            public string Marca { get; set; }
            public string Modelo { get; set; }
            public decimal Precio { get; set; }
            public decimal? PrecioAnterior { get; set; }
            public int CantidadColores { get; set; }
            public string? TextoPromocion { get; set; }
            public string UrlImagenPrincipal { get; set; }
        }

        public class ModificarCelularDTO
        {
            public int Id { get; set; }
            public string Marca { get; set; }
            public string Modelo { get; set; }
            public string Descripcion { get; set; }

        }

        public class ModificarVariacionDTO
        {
            public int VariacionId { get; set; }
            public int ColorId { get; set; }
            public decimal Precio { get; set; }
            public decimal? PrecioAnterior { get; set; }
            public string Almacenamiento { get; set; }
        }

        public class EspecificacionDTO
        {
            public string Nombre { get; set; }
            public string Valor { get; set; }
        }
    }
}
