using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Domain
{
    public class Cliente
    {
        public int Id { get; private set; }
        public string Dni { get; private set; }
        public string Nombre { get; private set; }
        public string Apellido { get; private set; }
        public string Email { get; private set; }
        public string Telefono { get; private set; }
        public string DireccionFacturacion { get; private set; }

        protected Cliente() { }

        public Cliente(string nombre, string apellido, string dni, string email, string telefono, string direccionFacturacion)
        {
            Nombre = nombre;
            Apellido = apellido;
            Dni = dni;
            Email = email;
            Telefono = telefono;
            DireccionFacturacion = direccionFacturacion;
        }

        public void ActualizarDatos(string telefono, string email, string direccionFacturacion)
        {
            Telefono = telefono;
            Email = email;
            DireccionFacturacion = direccionFacturacion;
        }



    }
}
