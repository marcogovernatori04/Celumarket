using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Domain
{
    public class Usuario
    {
        public int Id { get; private set; }
        public string Email { get; private set; }
        public string PasswordHash { get; private set; }

        public int RolId { get; private set; }
        public Rol Rol { get; private set; }

        public Cliente Cliente { get; private set; }

        protected Usuario() { }

        public Usuario(string email, string passwordHash, int rolId)
        {
            Email = email;
            PasswordHash = passwordHash;
            RolId = rolId;
        }

        public void CambiarPassword(string nuevoPasswordHash)
        {
            PasswordHash = nuevoPasswordHash;
        }
    }
}
