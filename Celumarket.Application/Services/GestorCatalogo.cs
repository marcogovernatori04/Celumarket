using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;
using static Celumarket.Application.DTOs.CatalogoDTOs;

namespace Celumarket.Application.Services
{
    public class GestorCatalogo : IGestorCatalogo
    {
        private readonly ICelularRepository _celularRepo;
        private readonly IVariacionRepository _variacionRepo;
        private readonly IServicioImagen _servicioImagen;
        private readonly IImagenRepository _imagenRepo;
        private readonly IEspecificacionRepository _especificacionRepo;
        private readonly IUnitOfWork _unitOfWork;

        public GestorCatalogo(
            ICelularRepository celularRepo, 
            IVariacionRepository variacionRepo, 
            IImagenRepository imagenRepo,
            IServicioImagen servicioImagen,
            IEspecificacionRepository especificacionRepo,
            IUnitOfWork unitOfWork)
        {
            _celularRepo = celularRepo;
            _variacionRepo = variacionRepo;
            _imagenRepo = imagenRepo;
            _servicioImagen = servicioImagen;
            _especificacionRepo = especificacionRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<int> CrearCelularAsync(CatalogoDTOs.CrearCelularDTO dto)
        {
            var nuevoCelular = new Celular(dto.Marca, dto.Modelo, dto.Descripcion);
            await _celularRepo.AgregarAsync(nuevoCelular);
            await _unitOfWork.GuardarAsync();

            return nuevoCelular.Id;
        }

        public async Task ModificarCelularAsync(CatalogoDTOs.ModificarCelularDTO dto)
        {
            var celular = await _celularRepo.ObtenerPorIdAsync(dto.Id);
            if (celular == null)
                throw new Exception("Celular no encontrado");
            celular.ActualizarDatos(dto.Marca, dto.Modelo, dto.Descripcion);
            await _unitOfWork.GuardarAsync();
        }

        public async Task EliminarCelularAsync(int id)
        {
            var celular = await _celularRepo.ObtenerPorIdAsync(id);
            if (celular == null)
                throw new Exception("Celular no encontrado");
            _celularRepo.Eliminar(celular);
            await _unitOfWork.GuardarAsync();
        }


        public async Task<int> AgregarVariacionAsync(CatalogoDTOs.AgregarVariacionDTO dto)
        {
            var celular = await _celularRepo.ObtenerPorIdAsync(dto.CelularId);
            if (celular == null)
                throw new Exception("Celular no encontrado");

            var nuevaVariacion = celular.AgregarVariacion(dto.ColorId, dto.Precio, dto.Almacenamiento, dto.StockInicial);
            if (dto.PrecioAnterior.HasValue)
            {
                nuevaVariacion.ActualizarPrecio(dto.Precio, dto.PrecioAnterior);
            }
            await _unitOfWork.GuardarAsync();
            return nuevaVariacion.Id;
        }

        public async Task<string> AgregarImagenAsync(int variacionId, Stream fileStream, string fileName, bool esPrincipal)
        {
            var variacion = await _variacionRepo.ObtenerPorIdAsync(variacionId);
            if (variacion == null)
                throw new Exception("Variación no encontrada");

            if (esPrincipal)
            {
                var imagenesExistentes = await _imagenRepo.ObtenerPorVariacionIdAsync(variacionId);
                foreach (var img in imagenesExistentes.Where(i => i.EsPrincipal))
                {
                    img.QuitarPrincipal();
                    await _imagenRepo.ActualizarAsync(img);
                }
            }

            string url = await _servicioImagen.SubirImagenAsync(fileStream, fileName);
            var nuevaImagen = new ImagenVariacion(variacionId, url, esPrincipal);


            await _imagenRepo.AgregarAsync(nuevaImagen);
            await _unitOfWork.GuardarAsync();
            return url;
        }

        public async Task AgregarEspecificacionesAsync(int celularId, List<EspecificacionDTO> dto)
        {
            var celular = await _celularRepo.ObtenerPorIdAsync(celularId);
            if (celular == null)
            {
                throw new Exception($"No se encontró el celular con ID {celularId}.");
            }

            var nuevasEspecificaciones = dto.Select(dto =>
                new Especificacion(celularId, dto.Nombre, dto.Valor)
            ).ToList();

            await _especificacionRepo.AgregarRangoAsync(nuevasEspecificaciones);
            await _unitOfWork.GuardarAsync();
        }

        public async Task<PaginacionDTO<CelularListadoDTO>> ListarCatalogoAsync(int pag, int cant)
        {
            var (celulares, total) = await _celularRepo.ObtenerTodosAsync(pag, cant);

            var items = celulares.Select(c => new CatalogoDTOs.CelularListadoDTO
            {
                Id = c.Id,
                Marca = c.Marca,
                Modelo = c.Modelo,
                PrecioMinimo = c.Variaciones.Any() ? c.Variaciones.Min(v => v.Precio) : 0,
                CantidadColores = c.Variaciones.Select(v => v.ColorId).Distinct().Count(),
                UrlImagenPrincipal = c.Variaciones.SelectMany(v => v.Imagenes).FirstOrDefault(img => img.EsPrincipal)?.UrlImagen
                                        ?? c.Variaciones.SelectMany(v => v.Imagenes).FirstOrDefault()?.UrlImagen
                                        ?? "https://placehold.co/600x400"

            }).ToList();

            return new PaginacionDTO<CatalogoDTOs.CelularListadoDTO>
            {
                Items = items,
                TotalItems = total,
                PaginaActual = pag,
                TotalPaginas = (int)Math.Ceiling(total / (double)cant)
            };
        }

        public async Task<CelularDetalleDTO> ObtenerDetalleCelularAsync(int id)
        {
            var celular = await _celularRepo.ObtenerDetalleAsync(id);
            if (celular == null)
                throw new Exception("Celular no encontrado");
            return new CelularDetalleDTO
            {
                Id = celular.Id,
                Marca = celular.Marca,
                Modelo = celular.Modelo,
                Descripcion = celular.Descripcion,
                Especificaciones = celular.Especificaciones.Select(e => new EspecificacionDTO
                {
                    Nombre = e.Nombre,
                    Valor = e.Valor
                }).ToList(),
                Variaciones = celular.Variaciones.Select(v => new VariacionDetalleDTO
                {
                    Id = v.Id,
                    Color = v.Color?.Nombre ?? "",
                    ColorId = v.ColorId,
                    ColorHex = v.Color?.Hex,
                    Precio = v.Precio,
                    PrecioAnterior = v.PrecioAnterior,
                    Almacenamiento = v.Almacenamiento,
                    Stock = v.StockDisponible,
                    Imagenes = v.Imagenes.Select(i => i.UrlImagen).ToList()
                }).ToList()
            };
        }

        public async Task ConfigurarDestacadoAsync(int celularId, ConfigurarDestacadoDTO dto)
        {
            var celular = await _celularRepo.ObtenerPorIdAsync(celularId);
            if (celular == null) throw new Exception("Celular no encontrado");

            celular.MarcarDestacado(dto.EsDestacado);
            celular.ActualizarTextoPromocion(dto.TextoPromocion);
            await _unitOfWork.GuardarAsync();
        }

        public async Task<List<CelularDestacadoDTO>> ListarDestacadosAsync(int cantidad = 4)
        {
            var destacados = await _celularRepo.ObtenerDestacadosAsync(cantidad);

            return destacados.Select(c =>
            {
                var variacionBase = c.Variaciones.OrderBy(v => v.Precio).FirstOrDefault();
                var urlImagen = c.Variaciones.SelectMany(v => v.Imagenes).FirstOrDefault(i => i.EsPrincipal)?.UrlImagen
                    ?? c.Variaciones.SelectMany(v => v.Imagenes).FirstOrDefault()?.UrlImagen
                    ?? "https://placehold.co/600x400";

                return new CelularDestacadoDTO
                {
                    Id = c.Id,
                    Marca = c.Marca,
                    Modelo = c.Modelo,
                    Precio = variacionBase?.Precio ?? 0,
                    PrecioAnterior = variacionBase?.PrecioAnterior,
                    CantidadColores = c.Variaciones.Select(v => v.ColorId).Distinct().Count(),
                    TextoPromocion = c.TextoPromocion,
                    UrlImagenPrincipal = urlImagen
                };
            }).ToList();
        }
    }
}
