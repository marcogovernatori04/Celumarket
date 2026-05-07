using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Celumarket.Infrastructure.Services
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(CelumarketContext context, IServicioSeguridad servicioSeguridad)
        {
            if (!await context.Roles.AnyAsync())
            {
                context.Roles.AddRange(
                    new Rol("Admin"),
                    new Rol("Cliente")
                );
                await context.SaveChangesAsync();
            }

            if (!await context.MetodosPago.AnyAsync())
            {
                context.MetodosPago.AddRange(
                    new MetodoPago("Transferencia", 1440),
                    new MetodoPago("Mercado Pago", 60)
                );
                await context.SaveChangesAsync();
            }

            if (!await context.Usuarios.AnyAsync(u => u.Email == "admin@celumarket.com"))
            {
                var rolAdmin = await context.Roles.FirstOrDefaultAsync(r => r.Nombre == "Admin");
                if (rolAdmin == null) 
                    throw new InvalidOperationException("No se encontró el rol 'Admin' para asignar al usuario admin.");
                string passHash = servicioSeguridad.EncriptarPassword("chancla123");

                var admin = new Usuario("admin@celumarket.com", passHash, rolAdmin.Id);
                context.Usuarios.Add(admin);
                await context.SaveChangesAsync();
            }

            if (!await context.Usuarios.AnyAsync(u => u.Rol.Nombre == "Cliente"))
            {
                var rolCliente = await context.Roles.FirstOrDefaultAsync(r => r.Nombre == "Cliente");
                string passHash = servicioSeguridad.EncriptarPassword("amolaplaya123");

                var usuario = new Usuario("viviperalta11@gmail.com", passHash, rolCliente.Id);
                context.Usuarios.Add(usuario);
                await context.SaveChangesAsync();
            }

            if (!await context.Clientes.AnyAsync())
            {
                var usuarioCliente = await context.Usuarios.FirstOrDefaultAsync(u => u.Email == "viviperalta11@gmail.com");

                if (usuarioCliente != null && !await context.Clientes.AnyAsync())
                {
                    var direccion = new Direccion("Aldo Patrone", "480", "", "Pergamino", "Buenos Aires", 2477);

                    var cliente = new Cliente("Viviana Eladia", "Peralta", "11222333", "2477123123", direccion, usuarioCliente.Id);
                    context.Clientes.Add(cliente);
                    await context.SaveChangesAsync();
                }
            }

            if (!await context.TarifasZonales.AnyAsync())
            {
                context.TarifasZonales.AddRange(
                    new TarifaZonal(2477, 11784.65m, 8040.48m, 3),
                    new TarifaZonal(2000, 10444.76m, 5918.38m, 2),
                    new TarifaZonal(2930, 13541.45m, 8040.48m, 4),
                    new TarifaZonal(2919, 10444.76m, 5918.38m, 2),
                    new TarifaZonal(2740, 11784.65m, 8040.48m, 4)
                    );

                await context.SaveChangesAsync();
            }

            if (!await context.Colores.AnyAsync())
            {
                context.Colores.AddRange(
                    new Color("Negro", "#1c1c1e"),
                    new Color("Blanco", "#f5f5f5"),
                    new Color("Grafito", "#1c1c1e"),
                    new Color("Lavanda", "#9966CC"),
                    new Color("Oliva", "#808000"),
                    new Color("Rosa", "#FFA6C9"),
                    new Color("Azul hielo", "#8AB9F1"),
                    new Color("Azul marino", "#011F5B"),
                    new Color("Plateado", "#C0C0C0")
                );
                await context.SaveChangesAsync();
            }
        }
    }
}
