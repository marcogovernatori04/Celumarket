using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Services
{
    public interface IServicioImagen
    {
        Task<string> SubirImagenAsync(Stream fileStream, string fileName);
    }
}
