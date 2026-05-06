using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Infrastructure.Security
{
    public class ServicioSeguridad : IServicioSeguridad
    {
        private readonly string _clavesecretaJWT;

        public ServicioSeguridad(IConfiguration config)
        {
            _clavesecretaJWT = config["Jwt:SecretKey"];

            if (string.IsNullOrEmpty(_clavesecretaJWT))
            {
                throw new ArgumentException("La clave secreta para JWT no puede estar vacía. Verifique la configuración.");
            }
        }

        public string EncriptarPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerificarPassword(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }

        public string GenerarToken(Usuario usuario)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Rol.Nombre)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_clavesecretaJWT));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "CelumarketAPI",
                audience: "CelumarketApp",
                claims: claims,
                expires: DateTime.Now.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
