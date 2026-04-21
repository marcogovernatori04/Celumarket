using Celumarket.Application.Interfaces;

namespace Celumarket.Application.Services
{
    public class GestorStock : IGestorStock
    {
        private readonly IVariacionRepository _variacionRepo;

        public GestorStock(IVariacionRepository variacionRepo)
        {
            _variacionRepo = variacionRepo;
        }

        public async Task IngresarMercaderiaAsync(int variacionId, int cantidad)
        {
            var variacion = await _variacionRepo.ObtenerPorIdAsync(variacionId);
            if (variacion == null)
                throw new Exception("Variación no encontrada.");

            variacion.AgregarStock(cantidad);

            await _variacionRepo.GuardarAsync();
        }

        public async Task RegistrarPerdidaAsync(int variacionId, int cantidad)
        {
            var variacion = await _variacionRepo.ObtenerPorIdAsync(variacionId);
            if (variacion == null)
                throw new Exception("Variación no encontrada.");

            variacion.DescontarStock(cantidad);

            await _variacionRepo.GuardarAsync();
        }
    }
}