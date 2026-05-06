using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Repositories
{
    public interface IImagenRepository
    {
        Task AgregarAsync(ImagenVariacion imagen);
        Task<IEnumerable<ImagenVariacion>> ObtenerPorVariacionIdAsync(int variacionId);
        Task ActualizarAsync(ImagenVariacion imagen);
    }
}
