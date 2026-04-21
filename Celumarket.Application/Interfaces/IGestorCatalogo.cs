using Celumarket.Application.DTOs;

namespace Celumarket.Application.Interfaces
{
    public interface IGestorCatalogo
    {
        Task<int> CrearCelularAsync(CatalogoDTOs.CrearCelularDTO dto);
        Task ModificarCelularAsync(CatalogoDTOs.ModificarCelularDTO dto);
        Task EliminarCelularAsync(int id);
        Task<int> AgregarVariacionAsync(CatalogoDTOs.AgregarVariacionDTO dto);
        Task AgregarImagenAsync(CatalogoDTOs.AgregarImagenDTO dto);
    }
}
