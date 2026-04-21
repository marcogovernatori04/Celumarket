using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Domain
{
    public class ImagenVariacion
    {
        public int Id { get; private set; }

        public int VariacionCelularId { get; private set; }

        public string UrlImagen { get; private set; }
        public bool EsPrincipal { get; private set; }

        protected ImagenVariacion() { }

        public ImagenVariacion(string urlImagen, bool esPrincipal)
        {
            UrlImagen = urlImagen;
            EsPrincipal = esPrincipal;
        }



    }
}
