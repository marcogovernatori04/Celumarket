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
        public string Telefono { get; private set; }

        public Direccion Direccion { get; private set; }

        public int UsuarioId { get; private set; }
        public Usuario Usuario { get; private set; }

        protected Cliente() { }

        public Cliente(string nombre, string apellido, string dni, string telefono, Direccion direccion, int usuarioId)
        {
            Nombre = nombre;
            Apellido = apellido;
            Dni = dni;
            Telefono = telefono;
            Direccion = direccion;      
            UsuarioId = usuarioId;
        }

        public void ActualizarDatos(string telefono, Direccion nuevaDireccion)
        {
            Telefono = telefono;
            Direccion = nuevaDireccion;
        }



    }
}
