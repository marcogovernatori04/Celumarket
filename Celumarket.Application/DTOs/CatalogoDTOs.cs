using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.DTOs
{
    public class CatalogoDTOs
    {
        public class CrearCelularDTO
        {
            public string Marca { get; set; }
            public string Modelo { get; set; }
            public string Descripcion { get; set; }
        }

        public class AgregarVariacionDTO
        {
            public int CelularId { get; set; }
            public string Color { get; set; }
            public decimal Precio { get; set; }
            public int StockInicial { get; set; }
        }

        public class AgregarImagenDTO
        {
            public int VariacionId { get; set; }
            public string UrlImagen { get; set; }
            public bool EsPrincipal { get; set; }   
        }

        public class ModificarCelularDTO
        {
            public int Id { get; set; }
            public string Marca { get; set; }
            public string Modelo { get; set; }
            public string Descripcion { get; set; }

        }
    }
}
