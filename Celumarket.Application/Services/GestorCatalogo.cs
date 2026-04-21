using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces;
using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Services
{
    public class GestorCatalogo : IGestorCatalogo
    {
        private readonly ICelularRepository _celularRepo;
        private readonly IVariacionRepository _variacionRepo;

        public GestorCatalogo(ICelularRepository celularRepo, IVariacionRepository variacionRepo)
        {
            _celularRepo = celularRepo;
            _variacionRepo = variacionRepo;
        }

        public async Task<int> CrearCelularAsync(CatalogoDTOs.CrearCelularDTO dto)
        {
            var nuevoCelular = new Celular(dto.Marca, dto.Modelo, dto.Descripcion);
            await _celularRepo.AgregarAsync(nuevoCelular);
            await _celularRepo.GuardarAsync();

            return nuevoCelular.Id;
        }

        public async Task ModificarCelularAsync(CatalogoDTOs.ModificarCelularDTO dto)
        {
            var celular = await _celularRepo.ObtenerPorIdAsync(dto.Id);
            if (celular == null)
                throw new Exception("Celular no encontrado");
            celular.ActualizarDatos(dto.Marca, dto.Modelo, dto.Descripcion);
            await _celularRepo.GuardarAsync();
        }

        public async Task EliminarCelularAsync(int id)
        {
            var celular = await _celularRepo.ObtenerPorIdAsync(id);
            if (celular == null)
                throw new Exception("Celular no encontrado");
            _celularRepo.Eliminar(celular);
            await _celularRepo.GuardarAsync();
        }


        public async Task<int> AgregarVariacionAsync(CatalogoDTOs.AgregarVariacionDTO dto)
        {
            var celular = await _celularRepo.ObtenerPorIdAsync(dto.CelularId);
            if (celular == null)
                throw new Exception("Celular no encontrado");

            var nuevaVariacion = celular.AgregarVariacion(dto.Color, dto.Precio, dto.StockInicial);
            await _celularRepo.GuardarAsync();
            return nuevaVariacion.Id;
        }

        public async Task AgregarImagenAsync(CatalogoDTOs.AgregarImagenDTO dto)
        {
            var variacion = await _variacionRepo.ObtenerPorIdAsync(dto.VariacionId);
            if (variacion == null)
                throw new Exception("Variación no encontrada");

            variacion.AgregarImagen(dto.UrlImagen, dto.EsPrincipal);

            await _variacionRepo.GuardarAsync();
        }
    }
}
