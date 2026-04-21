using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Domain
{
    public class VariacionCelular
    {
        public int Id { get; private set; }

        public int CelularId { get; private set; }

        public string Color { get; private set; }
        public decimal Precio { get; private set; }
        public int Stock { get; private set; }
        public int StockBloqueado { get; private set; }
        public int StockDisponible => Stock - StockBloqueado;

        public Celular Celular { get; private set; }
        public List<ImagenVariacion> Imagenes { get; private set; } = new List<ImagenVariacion>();

        protected VariacionCelular() { }

        public VariacionCelular(string color, decimal precio, int stockInicial)
        {
            Color = color;
            Precio = precio;
            Stock = stockInicial;
        }

        public void BloquearStock(int cantidad)
        {
            if (cantidad <= 0)
                throw new ArgumentException("La cantidad a bloquear debe ser mayor que cero.");
            if (this.Stock < cantidad)
                throw new InvalidOperationException($"No hay stock suficiente para bloquear el color {this.Color}");
            StockBloqueado += cantidad;
        }

        public void LiberarBloqueo(int cantidad)
        {
            if (cantidad <= 0)
                throw new ArgumentException("La cantidad a liberar debe ser mayor que cero.");
            if (this.StockBloqueado < cantidad)
                throw new InvalidOperationException($"No hay stock bloqueado suficiente para liberar el color {this.Color}");
            StockBloqueado = Math.Max(StockBloqueado - cantidad, 0);
        }

        public void AgregarStock(int cantidad)
        {
            if (cantidad <= 0)
                throw new ArgumentException("La cantidad a agregar debe ser mayor que cero.");

            this.Stock += cantidad;
        }

        public void DescontarStock(int cantidad)
        {
            if (cantidad <= 0)
                throw new ArgumentException("La cantidad a descontar debe ser mayor que cero.");
            if (this.Stock < cantidad)
                throw new InvalidOperationException($"No hay stock para el color {this.Color}");

            StockBloqueado = Math.Max(StockBloqueado - cantidad, 0);
            this.Stock -= cantidad;
        }

        public void AgregarImagen(string urlImagen, bool esPrincipal)
        {
            if (esPrincipal)
                {
                var imagenPrincipalExistente = Imagenes.FirstOrDefault(img => img.EsPrincipal);
                if (imagenPrincipalExistente != null)
                {
                    imagenPrincipalExistente = new ImagenVariacion(imagenPrincipalExistente.UrlImagen, false);
                }
            }
            var nuevaImagen = new ImagenVariacion(urlImagen, esPrincipal);
            Imagenes.Add(nuevaImagen);
        }



    }
}
