using Celumarket.Domain;

namespace Celumarket.Application.Interfaces.Repositories
{
    public interface IColorRepository
    {
        Task<List<Color>> ObtenerActivosAsync();
        Task<Color?> ObtenerPorIdAsync(int id);
        Task<Color?> ObtenerPorNombreAsync(string nombre);
        Task AgregarAsync(Color color);
    }
}
