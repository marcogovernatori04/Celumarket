using Celumarket.Application.Interfaces;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;

namespace Celumarket.Application.Services
{
    public class GestorStock : IGestorStock
    {
        private readonly IVariacionRepository _variacionRepo;
        private readonly IUnitOfWork _unitOfWork;

        public GestorStock(IVariacionRepository variacionRepo, IUnitOfWork unitOfWork)
        {
            _variacionRepo = variacionRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task IngresarMercaderiaAsync(int variacionId, int cantidad)
        {
            var variacion = await _variacionRepo.ObtenerPorIdAsync(variacionId);
            if (variacion == null)
                throw new Exception("Variación no encontrada.");

            variacion.AgregarStock(cantidad);

            await _unitOfWork.GuardarAsync();
        }

        public async Task RegistrarPerdidaAsync(int variacionId, int cantidad)
        {
            var variacion = await _variacionRepo.ObtenerPorIdAsync(variacionId);
            if (variacion == null)
                throw new Exception("Variación no encontrada.");

            variacion.DescontarStock(cantidad);

            await _unitOfWork.GuardarAsync();
        }
    }
}