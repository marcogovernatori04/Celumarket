using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Domain
{
    public class Direccion
    {
        public string Calle { get; private set; }
        public string Numero { get; private set; }
        public string PisoDepto { get; private set; }
        public string Localidad { get; private set; }
        public string Provincia { get; private set; }
        public int CodigoPostal { get; private set; }

        protected Direccion() { }

        public Direccion(string calle, string numero, string pisoDepto, string localidad, string provincia, int codigoPostal)
        {
            Calle = calle;
            Numero = numero;
            PisoDepto = pisoDepto;
            Localidad = localidad;
            Provincia = provincia;
            CodigoPostal = codigoPostal;
        }
    }
}
