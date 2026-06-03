using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces.Services;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Infrastructure.Services
{
    public class ServicioImagen : IServicioImagen
    {
        private readonly Cloudinary _cloudinary;
        private readonly CloudinarySettings _settings;

        public ServicioImagen(IOptions<CloudinarySettings> config)
        {
            _settings = config.Value;
            var account = new Account(_settings.CloudName, _settings.ApiKey, _settings.ApiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> SubirImagenAsync(Stream fileStream, string fileName)
        {
            if (fileStream == null || fileStream.Length == 0) 
                throw new ArgumentNullException(nameof(fileStream));

            if (string.IsNullOrWhiteSpace(_settings.CloudName) ||
                string.IsNullOrWhiteSpace(_settings.ApiKey) ||
                string.IsNullOrWhiteSpace(_settings.ApiSecret) ||
                _settings.CloudName.StartsWith("MY_", StringComparison.OrdinalIgnoreCase) ||
                _settings.ApiKey.StartsWith("MY_", StringComparison.OrdinalIgnoreCase) ||
                _settings.ApiSecret.StartsWith("MY_", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("Cloudinary no está configurado. Revisá CloudinarySettings en user-secrets, variables de entorno o appsettings.Development.json.");
            }

            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(fileName, fileStream),
                Transformation = new Transformation().Height(800).Width(800).Crop("limit")
            };

            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result.Error != null)
                throw new InvalidOperationException($"Cloudinary rechazó la imagen: {result.Error.Message}");

            if (result.SecureUrl == null)
                throw new InvalidOperationException("Cloudinary no devolvió una URL para la imagen.");

            return result.SecureUrl.ToString();
        }
    }
}
