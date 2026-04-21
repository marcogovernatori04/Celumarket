namespace Celumarket.Domain
{
    public class Celular
    {
        public int Id { get; private set; }
        public string Marca { get; private set; }
        public string Modelo { get; private set; }
        public string Descripcion { get; private set; }
        public List<VariacionCelular> Variaciones { get; private set; } = new List<VariacionCelular>();

        protected Celular() { }

        // constructor
        public Celular(string marca, string modelo, string descripcion)
        {
            Marca = marca;
            Modelo = modelo;
            Descripcion = descripcion;
        }

        public VariacionCelular AgregarVariacion(string color, decimal precio, int stockInicial)
        {
            if (Variaciones.Any(v => v.Color.Equals(color, StringComparison.OrdinalIgnoreCase)))
                throw new InvalidOperationException("Ya existe una variación con ese color.");

            var nuevaVariacion = new VariacionCelular(color, precio, stockInicial);
            Variaciones.Add(nuevaVariacion);
            return nuevaVariacion;
        }

        public int ObtenerStockTotal()
        {
            return Variaciones.Sum(v => v.Stock);
        }

        public void ActualizarDatos(string marca, string modelo, string descripcion)
        {
            Marca = marca;
            Modelo = modelo;
            Descripcion = descripcion;
        }
    }
}
