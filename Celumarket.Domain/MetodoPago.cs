using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Domain
{
    public class MetodoPago
    {
        public int Id { get; private set; }
        public string Nombre { get; private set; }
        public decimal Recargo { get; private set; }
        public bool Activo { get; private set; }
        public int MinutosPlazo { get; private set; }

        protected MetodoPago() { }

        public MetodoPago(string nombre, decimal recargo, int minutosPlazo)
        {
            Nombre = nombre;
            Recargo = recargo;
            Activo = true;
            MinutosPlazo = minutosPlazo;
        }

        public void Desactivar() => Activo = false;
    }
}
