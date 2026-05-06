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

        public ServicioImagen(IOptions<CloudinarySettings> config)
        {
            var account = new Account(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> SubirImagenAsync(Stream fileStream, string fileName)
        {
            if (fileStream == null || fileStream.Length == 0) 
                throw new ArgumentNullException(nameof(fileStream));

            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(fileName, fileStream),
                Transformation = new Transformation().Height(800).Width(800).Crop("limit")
            };

            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result.Error != null)
                throw new Exception($"Error en Cloudinary: {result.Error.Message}");

            return result.SecureUrl.ToString();
        }
    }
}
