namespace Celumarket.Domain
{
    public class Celular
    {
        public int Id { get; private set; }
        public string Marca { get; private set; }
        public string Modelo { get; private set; }
        public string Descripcion { get; private set; }
        public bool EsDestacado { get; private set; }
        public string? TextoPromocion { get; private set; }
        public List<VariacionCelular> Variaciones { get; private set; } = new List<VariacionCelular>();
        public List<Especificacion> Especificaciones { get; private set; } = new List<Especificacion>();

        protected Celular() { }

        // constructor
        public Celular(string marca, string modelo, string descripcion)
        {
            Marca = marca;
            Modelo = modelo;
            Descripcion = descripcion;
        }

        public VariacionCelular AgregarVariacion(int colorId, decimal precio, string almacenamiento, int stockInicial)
        {
            if (Variaciones.Any(v => v.ColorId == colorId))
                throw new InvalidOperationException("Ya existe una variación con ese color.");

            var nuevaVariacion = new VariacionCelular(colorId, precio, almacenamiento, stockInicial);
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

        public void MarcarDestacado(bool esDestacado)
        {
            EsDestacado = esDestacado;
        }

        public void ActualizarTextoPromocion(string? textoPromocion)
        {
            TextoPromocion = string.IsNullOrWhiteSpace(textoPromocion) ? null : textoPromocion.Trim();
        }
    }
}
