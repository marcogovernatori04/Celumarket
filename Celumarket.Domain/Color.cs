namespace Celumarket.Domain
{
    public class Color
    {
        public int Id { get; private set; }
        public string Nombre { get; private set; }
        public string Hex { get; private set; }
        public bool Activo { get; private set; } = true;

        public List<VariacionCelular> Variaciones { get; private set; } = new();

        protected Color() { }

        public Color(string nombre, string hex)
        {
            Nombre = nombre?.Trim() ?? throw new ArgumentNullException(nameof(nombre));
            Hex = hex?.Trim() ?? throw new ArgumentNullException(nameof(hex));
        }

        public void Actualizar(string nombre, string hex, bool activo)
        {
            Nombre = nombre?.Trim() ?? throw new ArgumentNullException(nameof(nombre));
            Hex = hex?.Trim() ?? throw new ArgumentNullException(nameof(hex));
            Activo = activo;
        }
    }
}
