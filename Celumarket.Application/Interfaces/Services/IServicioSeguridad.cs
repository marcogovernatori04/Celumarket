using Celumarket.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Application.Interfaces.Services
{
    public interface IServicioSeguridad
    {
        string EncriptarPassword(string password);
        bool VerificarPassword(string password, string hash);
        string GenerarToken(Usuario usuario);
    }
}
