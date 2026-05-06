using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Domain
{
    public class ItemCarrito
    {
        public int Id { get; private set; }
        public int VariacionId { get; private set; }
        public int Cantidad { get; private set; }

        public int CarritoId { get; private set; }

        public VariacionCelular VariacionCelular { get; private set; }

        protected ItemCarrito() { }

        public ItemCarrito(int variacionId, int cantidad)
        {
            if (variacionId <= 0) throw new ArgumentException("Variación inválida.");
            if (cantidad <= 0) throw new ArgumentException("La cantidad debe ser mayor a cero.");
            VariacionId = variacionId;
            Cantidad = cantidad;
        }

        public void Sumar(int cantidad)
        {
            if (cantidad <= 0) throw new ArgumentException("La cantidad a sumar debe ser mayor a cero.");
            Cantidad += cantidad;
        }

        public void Restar(int cantidad)
        {
            if (cantidad <= 0) throw new ArgumentException("La cantidad a restar debe ser mayor a cero.");
            if (cantidad > Cantidad) throw new InvalidOperationException("No se puede restar más cantidad de la existente.");
            Cantidad -= cantidad;
        }
    }
}
