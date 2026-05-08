using System;

namespace Celumarket.Domain
{
    public class ReservaCheckoutItem
    {
        public int Id { get; private set; }
        public int ReservaCheckoutId { get; private set; }
        public int VariacionId { get; private set; }
        public int Cantidad { get; private set; }

        public VariacionCelular VariacionCelular { get; private set; }

        protected ReservaCheckoutItem() { }

        public ReservaCheckoutItem(int variacionId, int cantidad)
        {
            if (variacionId <= 0) throw new ArgumentException("Variación inválida.");
            if (cantidad <= 0) throw new ArgumentException("Cantidad inválida.");
            VariacionId = variacionId;
            Cantidad = cantidad;
        }
    }
}
