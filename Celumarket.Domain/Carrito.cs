using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Domain
{
    public class Carrito
    {
        public int Id { get; private set; }
        public int ClienteId { get; private set; }

        public List<ItemCarrito> Items { get; private set; } = new List<ItemCarrito>();

        protected Carrito() { }

        public Carrito(int clienteId)
        {
            ClienteId = clienteId;
        }

        public void AgregarItem(int variacionId, int cantidad)
        {
            var itemExistente = Items.FirstOrDefault(i => i.VariacionId == variacionId);
            if (itemExistente != null)
            {
                itemExistente.Sumar(cantidad);
            }
            else
            {
                Items.Add(new ItemCarrito(variacionId, cantidad));
            }
        }
        
        public void RestarItem(int variacionId, int cantidad)
        {
            var itemExistente = Items.FirstOrDefault(i => i.VariacionId == variacionId);
            if (itemExistente != null)
            {
                itemExistente.Restar(cantidad);
                if (itemExistente.Cantidad <= 0)
                {
                    Items.Remove(itemExistente);
                }
            }
        }

        public void EliminarItem(int variacionId)
        {
            var item = Items.FirstOrDefault(i => i.VariacionId == variacionId);
            if (item != null)
            {
                Items.Remove(item);
            }
        }   

        public void Vaciar()
        {
            Items.Clear();
        }
    }
}
