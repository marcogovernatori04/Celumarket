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
        public bool Activo { get; private set; }
        public int MinutosPlazo { get; private set; }

        protected MetodoPago() { }

        public MetodoPago(string nombre, int minutosPlazo)
        {
            if (string.IsNullOrWhiteSpace(nombre)) throw new ArgumentException("El nombre del método de pago es obligatorio.");
            if (minutosPlazo <= 0) throw new ArgumentException("El plazo debe ser mayor a cero.");
            Nombre = nombre;
            Activo = true;
            MinutosPlazo = minutosPlazo;
        }

        public void Desactivar() => Activo = false;
    }
}
