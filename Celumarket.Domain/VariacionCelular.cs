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
        public int ColorId { get; private set; }

        public decimal Precio { get; private set; }
        public decimal? PrecioAnterior { get; private set; }
        public string Almacenamiento { get; private set; }
        public int Stock { get; private set; }
        public int StockBloqueado { get; private set; }
        public int StockDisponible => Stock - StockBloqueado;

        public Celular Celular { get; private set; }
        public Color Color { get; private set; }
        public List<ImagenVariacion> Imagenes { get; private set; } = new List<ImagenVariacion>();

        protected VariacionCelular() { }

        public VariacionCelular(int colorId, decimal precio, string almacenamiento, int stockInicial)
        {
            ColorId = colorId;
            Precio = precio;
            Almacenamiento = almacenamiento;
            Stock = stockInicial;
        }

        public void ActualizarPrecio(decimal nuevoPrecio, decimal? nuevoPrecioAnterior = null)
        {
            if (nuevoPrecio <= 0) throw new ArgumentException("El precio debe ser mayor a cero.");
            if (nuevoPrecioAnterior.HasValue && nuevoPrecioAnterior.Value <= nuevoPrecio)
                throw new ArgumentException("El precio anterior debe ser mayor al precio actual.");

            Precio = nuevoPrecio;
            PrecioAnterior = nuevoPrecioAnterior;
        }

        public void BloquearStock(int cantidad)
        {
            if (cantidad <= 0)
                throw new ArgumentException("La cantidad a bloquear debe ser mayor que cero.");
            if (this.StockDisponible < cantidad)
                throw new InvalidOperationException($"No hay stock suficiente para bloquear el color {this.Color?.Nombre ?? this.ColorId.ToString()}");
            StockBloqueado += cantidad;
        }

        public void LiberarBloqueo(int cantidad)
        {
            if (cantidad <= 0)
                throw new ArgumentException("La cantidad a liberar debe ser mayor que cero.");
            if (this.StockBloqueado < cantidad)
                throw new InvalidOperationException($"No hay stock bloqueado suficiente para liberar el color {this.Color?.Nombre ?? this.ColorId.ToString()}");
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
                throw new InvalidOperationException($"No hay stock para el color {this.Color?.Nombre ?? this.ColorId.ToString()}");

            StockBloqueado = Math.Max(StockBloqueado - cantidad, 0);
            this.Stock -= cantidad;
        }
    }
}
