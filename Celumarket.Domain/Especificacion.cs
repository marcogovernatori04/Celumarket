using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Domain
{
    public class Especificacion
    {
        public int Id { get; private set; }

        public int CelularId { get; private set; }
        public Celular Celular { get; private set; }

        public string Nombre { get; private set; }
        public string Valor { get; private set; }

        protected Especificacion() { }

        public Especificacion(int celularId, string nombre,  string valor)
        {
            CelularId = celularId;
            Nombre = nombre;
            Valor = valor;
        }
    }
}
