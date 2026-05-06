using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Domain
{
    public class Rol
    {
        public int Id { get; private set; }
        public string Nombre { get; private set; }

        public ICollection<Usuario> Usuarios { get; private set; }

        protected Rol() { }

        public Rol(string nombre)
        {
            Nombre = nombre;
        }
    }
}
