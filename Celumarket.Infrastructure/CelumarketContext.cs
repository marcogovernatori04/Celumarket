using Celumarket.Domain;
using Microsoft.EntityFrameworkCore;

namespace Celumarket.Infrastructure
{
    public class CelumarketContext : DbContext
    {
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<MetodoPago> MetodosPago { get; set; }
        public DbSet<Celular> Celulares { get; set; }
        public DbSet<VariacionCelular> Variaciones { get; set; }
        public DbSet<ImagenVariacion> ImagenesVariacion { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<LineaPedido> LineasPedido { get; set; }
        public DbSet<Pago> Pagos { get; set; }
        public DbSet<Envio> Envios { get; set; }
        public DbSet<Factura> Facturas { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=.\\SQLEXPRESS;Database=CelumarketDB;Trusted_Connection=True;TrustServerCertificate=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<VariacionCelular>()
                .HasOne(v => v.Celular)
                .WithMany(c => c.Variaciones)
                .HasForeignKey(v => v.CelularId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ImagenVariacion>()
                .HasOne<VariacionCelular>() 
                .WithMany(v => v.Imagenes)
                .HasForeignKey(i => i.VariacionCelularId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<LineaPedido>()
                .HasOne<Pedido>()
                .WithMany(p => p.Lineas)
                .HasForeignKey(l => l.PedidoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Pedido>()
                .HasOne<Cliente>() 
                .WithMany()        
                .HasForeignKey(p => p.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Pago>()
                .HasOne<Pedido>()
                .WithOne()
                .HasForeignKey<Pago>(p => p.PedidoId)
                .OnDelete(DeleteBehavior.Cascade); 

            modelBuilder.Entity<Pago>()
                .HasOne<MetodoPago>()
                .WithMany()
                .HasForeignKey(p => p.MetodoPagoId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Envio>()
                .HasOne<Pedido>()
                .WithOne()
                .HasForeignKey<Envio>(e => e.PedidoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Factura>()
                .HasOne<Pedido>()
                .WithOne()
                .HasForeignKey<Factura>(f => f.PedidoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Cliente>()
                .HasIndex(c => c.Dni)
                .IsUnique();

            modelBuilder.Entity<VariacionCelular>().Property(v => v.Precio).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<LineaPedido>().Property(l => l.PrecioUnitario).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Pago>().Property(p => p.Monto).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<MetodoPago>().Property(m => m.Recargo).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Envio>().Property(e => e.Costo).HasColumnType("decimal(18,2)");
        }
    }
}