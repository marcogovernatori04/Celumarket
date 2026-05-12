using Celumarket.Domain;
using Microsoft.EntityFrameworkCore;

namespace Celumarket.Infrastructure
{
    public class CelumarketContext : DbContext
    {
        public CelumarketContext(DbContextOptions<CelumarketContext> options) : base(options) { }

        public DbSet<Rol> Roles { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Carrito> Carritos { get; set; }
        public DbSet<ItemCarrito> ItemsCarrito { get; set; }
        public DbSet<Celular> Celulares { get; set; }
        public DbSet<VariacionCelular> Variaciones { get; set; }
        public DbSet<ImagenVariacion> ImagenesVariacion { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<ReservaCheckout> ReservasCheckout { get; set; }
        public DbSet<ReservaCheckoutItem> ReservasCheckoutItems { get; set; }
        public DbSet<LineaPedido> LineasPedido { get; set; }
        public DbSet<Pago> Pagos { get; set; }
        public DbSet<MetodoPago> MetodosPago { get; set; }
        public DbSet<Envio> Envios { get; set; }
        public DbSet<Factura> Facturas { get; set; }
        public DbSet<TarifaZonal> TarifasZonales { get; set; }
        public DbSet<ConfiguracionSistema> ConfiguracionesSistema { get; set; }
        public DbSet<Especificacion> Especificaciones { get; set; }
        public DbSet<Color> Colores { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // usuario
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.Rol)
                .WithMany(r => r.Usuarios)
                .HasForeignKey(u => u.RolId)
                .OnDelete(DeleteBehavior.Restrict);

            // cliente
            modelBuilder.Entity<Cliente>()
                .HasOne(c => c.Usuario)
                .WithOne(u => u.Cliente)
                .HasForeignKey<Cliente>(c => c.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Cliente>(entity =>
            {
                entity.HasIndex(c => c.Dni)
                    .IsUnique();

                entity.OwnsOne(c => c.Direccion, d =>
                {
                    d.Property(p => p.Calle).HasMaxLength(100).IsRequired();
                    d.Property(p => p.Numero).HasMaxLength(20).IsRequired();
                    d.Property(p => p.PisoDepto).HasMaxLength(20);
                    d.Property(p => p.Localidad).HasMaxLength(50).IsRequired();
                    d.Property(p => p.Provincia).HasMaxLength(50).IsRequired();
                    d.Property(p => p.CodigoPostal).HasMaxLength(10).IsRequired();
                });
            });


            // carrito
            modelBuilder.Entity<Carrito>()
                .HasOne<Cliente>()
                .WithMany()
                .HasForeignKey(c => c.ClienteId)
                .OnDelete(DeleteBehavior.Cascade);

            // item carrito
            modelBuilder.Entity<ItemCarrito>()
                .HasOne<Carrito>()
                .WithMany(c => c.Items)
                .HasForeignKey(i => i.CarritoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ItemCarrito>()
                .HasOne(i => i.VariacionCelular)
                .WithMany()
                .HasForeignKey(i => i.VariacionId)
                .OnDelete(DeleteBehavior.Restrict);

            // celular - variacion - imagen
            modelBuilder.Entity<VariacionCelular>()
                .HasOne(v => v.Celular)
                .WithMany(c => c.Variaciones)
                .HasForeignKey(v => v.CelularId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VariacionCelular>()
                .HasOne(v => v.Color)
                .WithMany(c => c.Variaciones)
                .HasForeignKey(v => v.ColorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Color>()
                .HasIndex(c => c.Nombre)
                .IsUnique();

            modelBuilder.Entity<ImagenVariacion>()
                .HasOne<VariacionCelular>()
                .WithMany(v => v.Imagenes)
                .HasForeignKey(i => i.VariacionCelularId)
                .OnDelete(DeleteBehavior.Cascade);

            // pedido
            modelBuilder.Entity<Pedido>()
                .HasOne<Cliente>()
                .WithMany()
                .HasForeignKey(p => p.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ReservaCheckout>()
                .HasOne<Cliente>()
                .WithMany()
                .HasForeignKey(r => r.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ReservaCheckoutItem>()
                .HasOne<ReservaCheckout>()
                .WithMany(r => r.Items)
                .HasForeignKey(i => i.ReservaCheckoutId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ReservaCheckoutItem>()
                .HasOne(i => i.VariacionCelular)
                .WithMany()
                .HasForeignKey(i => i.VariacionId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Pedido>(p =>
            {
                p.OwnsOne(x => x.DireccionEntrega, d =>
                {
                    d.Property(p => p.Calle).HasColumnName("CalleEntrega");
                    d.Property(p => p.Numero).HasColumnName("NumeroEntrega");
                    d.Property(p => p.PisoDepto).HasColumnName("PisoDeptoEntrega");
                    d.Property(p => p.Localidad).HasColumnName("LocalidadEntrega");
                    d.Property(p => p.Provincia).HasColumnName("ProvinciaEntrega");
                    d.Property(p => p.CodigoPostal).HasColumnName("CodigoPostalEntrega");
                });
            });

            // linea pedido
            modelBuilder.Entity<LineaPedido>()
                .HasOne<Pedido>()
                .WithMany(p => p.Lineas)
                .HasForeignKey(l => l.PedidoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<LineaPedido>()
                .HasOne(l => l.VariacionCelular)
                .WithMany()
                .HasForeignKey(l => l.VariacionId)
                .OnDelete(DeleteBehavior.Restrict);

            // pago
            modelBuilder.Entity<Pago>()
                .HasOne<Pedido>()
                .WithMany()
                .HasForeignKey(p => p.PedidoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Pago>()
                .HasOne<MetodoPago>()
                .WithMany()
                .HasForeignKey(p => p.MetodoPagoId)
                .OnDelete(DeleteBehavior.Restrict);

            // envío
            modelBuilder.Entity<Envio>()
                .HasOne<Pedido>()
                .WithOne()
                .HasForeignKey<Envio>(e => e.PedidoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Envio>(entity =>
            {
                entity.OwnsOne(e => e.DireccionEntrega, d =>
                {
                    d.Property(p => p.Calle).HasColumnName("Calle");
                    d.Property(p => p.Numero).HasColumnName("Numero");
                    d.Property(p => p.PisoDepto).HasColumnName("PisoDepto");
                    d.Property(p => p.Localidad).HasColumnName("Localidad");
                    d.Property(p => p.Provincia).HasColumnName("Provincia");
                    d.Property(p => p.CodigoPostal).HasColumnName("CodigoPostal");
                });
            });


            // factura
            modelBuilder.Entity<Factura>()
                .HasOne<Pedido>()
                .WithOne()
                .HasForeignKey<Factura>(f => f.PedidoId)
                .OnDelete(DeleteBehavior.Cascade);

            // decimales
            modelBuilder.Entity<VariacionCelular>().Property(v => v.Precio).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<LineaPedido>().Property(l => l.PrecioUnitario).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Pago>().Property(p => p.Monto).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Pedido>().Property(p => p.DescuentoAplicado).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Pedido>().Property(p => p.CostoEnvio).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Envio>().Property(e => e.Costo).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<TarifaZonal>().Property(t => t.PrecioDomicilio).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<TarifaZonal>().Property(t => t.PrecioSucursal).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<ConfiguracionSistema>().Property(c => c.DescuentoTransferencia).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<ConfiguracionSistema>().Property(c => c.UmbralEnvioGratis).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<ConfiguracionSistema>().Property(c => c.TextoBannerHero).HasMaxLength(120);
        }
    }
}
