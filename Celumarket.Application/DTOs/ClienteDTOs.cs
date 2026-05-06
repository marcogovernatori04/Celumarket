namespace Celumarket.Application.DTOs
{
    public class ClienteDTOs
    {
        public class RegistrarClienteDTO
        {
            public string Dni { get; set; }
            public string Nombre { get; set; }
            public string Apellido { get; set; }
            public string Email { get; set; }
            public string Telefono { get; set; }
            public string Calle { get; set; }
            public string Numero { get; set; }
            public string PisoDepto { get; set; }
            public string Localidad { get; set; }
            public string Provincia { get; set; }
            public int CodigoPostal { get; set; }
            public string Password { get; set; }
        }

        public class LoginDTO
        {
            public string Email { get; set; }
            public string Password { get; set; }    
        }

        public class ActualizarClienteDTO
        {
            public int ClienteId { get; set; }
            public string Telefono { get; set; }
            public string Calle { get; set; }
            public string Numero { get; set; }
            public string PisoDepto { get; set; }
            public string Localidad { get; set; }
            public string Provincia { get; set; }
            public int CodigoPostal { get; set; }
        }

        public class ClienteDetalleDTO
        {
            public string NombreCompleto { get; set; }  
            public string Email { get; set; }
            public string Telefono { get; set; }
            public string Dni { get; set; }
        }

        public class ClienteListadoDTO
        {
            public int Id {  get; set; }
            public string NombreCompleto { get; set; }
            public string Email { get; set; }
            public string Telefono { get; set; }
            public string Calle { get; set; }
            public string Numero { get; set; }
            public string PisoDepto { get; set; }
            public string Localidad { get; set; }
            public string Provincia { get; set; }
            public int CodigoPostal { get; set; }

            public decimal TotalComprado { get; set; }


        }

    }
}
