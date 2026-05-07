using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;

namespace Celumarket.Application.Services
{
    public class GestorCarrito : IGestorCarrito
    {
        private readonly ICarritoRepository _carritoRepo;
        private readonly IUnitOfWork _unitOfWork;

        public GestorCarrito(ICarritoRepository carritoRepo, IUnitOfWork unitOfWork)
        {
            _carritoRepo = carritoRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<CarritoDTOs.CarritoDetalleDTO> ObtenerCarritoClienteAsync(int clienteId)
        {
            var carrito = await _carritoRepo.ObtenerPorClienteIdAsync(clienteId);
            if (carrito == null)
                return new CarritoDTOs.CarritoDetalleDTO { ClienteId = clienteId };
            return new CarritoDTOs.CarritoDetalleDTO
            {
                Id = carrito.Id,
                ClienteId = carrito.ClienteId,
                Items = carrito.Items.Select(i => new CarritoDTOs.ItemCarritoDTO
                {
                    VariacionId = i.VariacionId,
                    Marca = i.VariacionCelular.Celular.Marca,
                    Modelo = i.VariacionCelular.Celular.Modelo,
                    Color = i.VariacionCelular.Color.Nombre,
                    Cantidad = i.Cantidad,
                    PrecioUnitario = i.VariacionCelular.Precio,
                    UrlImagen = i.VariacionCelular.Imagenes.FirstOrDefault(img => img.EsPrincipal)?.UrlImagen
                                ?? i.VariacionCelular.Imagenes.FirstOrDefault()?.UrlImagen ?? ""
                }).ToList()
            };
        }

        public async Task AgregarItemAsync(int clienteId, CarritoDTOs.AgregarItemDTO dto)
        {
            var carrito = await _carritoRepo.ObtenerPorClienteIdAsync(clienteId);
            if (carrito == null)
            {
                carrito = new Carrito(clienteId);
                await _carritoRepo.AgregarAsync(carrito);
            }

            carrito.AgregarItem(dto.VariacionId, dto.Cantidad);

            await _unitOfWork.GuardarAsync();
        }

        public async Task RestarItemAsync(int clienteId, int variacionId, int cantidad = 1)
        {
            var carrito = await _carritoRepo.ObtenerPorClienteIdAsync(clienteId);
            if (carrito == null)
                return;
            carrito.RestarItem(variacionId, cantidad);
            await _unitOfWork.GuardarAsync();
        }

        public async Task EliminarItemAsync(int clienteId, int variacionId)
        {
            var carrito = await _carritoRepo.ObtenerPorClienteIdAsync(clienteId);
            if (carrito == null)
                return;
            carrito.EliminarItem(variacionId);
            await _unitOfWork.GuardarAsync();
        }

        public async Task VaciarCarritoAsync(int clienteId)
        {
            var carrito = await _carritoRepo.ObtenerPorClienteIdAsync(clienteId);
            if (carrito == null)
                return;
            carrito.Vaciar();
            await _unitOfWork.GuardarAsync();
        }
    }
}
