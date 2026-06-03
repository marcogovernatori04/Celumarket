namespace Celumarket.API.Request_DTOs
{
    public class SubirImagenDTO
    {
        public IFormFile Archivo {  get; set; }
        public bool EsPrincipal { get; set; }
    }

    public class SubirImagenHeroDTO
    {
        public IFormFile Archivo { get; set; }
    }
}
