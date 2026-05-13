using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Celumarket.Application.DTOs.ClienteDTOs;

namespace Celumarket.Infrastructure.Repositories
{
    public class ClienteRepository : IClienteRepository
    { 
        private readonly CelumarketContext _context;

        public ClienteRepository(CelumarketContext context)
        {
            _context = context;
        }

        public async Task AgregarAsync(Cliente cliente)
        {
            await _context.Clientes.AddAsync(cliente);
        }
        public async Task<Cliente> ObtenerPorDniAsync(string dni)
        {
            return await _context.Clientes.FirstOrDefaultAsync(c => c.Dni == dni);
        }

        public async Task<Cliente> ObtenerPorIdAsync(int id)
        {
            return await _context.Clientes
                .Include(c => c.Usuario)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Cliente?> ObtenerPorUsuarioIdAsync(int usuarioId)
        {
            return await _context.Clientes
                .Include(c => c.Usuario)
                .FirstOrDefaultAsync(c => c.UsuarioId == usuarioId);
        }

        public async Task<IEnumerable<ClienteListadoDTO>> ObtenerTodosAsync()
        {
            return await _context.Clientes
                .Select(c => new ClienteListadoDTO
                {
                    Id = c.Id,
                    NombreCompleto = $"{c.Nombre} {c.Apellido}",
                    Rol = c.Usuario.Rol.Nombre,
                    Telefono = c.Telefono ?? "-",
                    Email = c.Usuario.Email,
                    Calle = c.Direccion != null ? c.Direccion.Calle : "Sin calle",
                    Numero = c.Direccion != null ? c.Direccion.Numero : "-",
                    PisoDepto = c.Direccion != null ? c.Direccion.PisoDepto : "-",
                    Localidad = c.Direccion != null ? c.Direccion.Localidad : "Sin localidad",
                    Provincia = c.Direccion != null ? c.Direccion.Provincia : "Sin provincia",
                    CodigoPostal = c.Direccion != null ? c.Direccion.CodigoPostal : 0,
                    CantidadPedidos = _context.Pedidos.Count(p => p.ClienteId == c.Id),

                    TotalComprado = _context.Pedidos
                                        .Where(p => p.ClienteId == c.Id && p.Estado == Pedido.EstadoPagado)
                                        .SelectMany(p => p.Lineas)
                                        .Sum(lp => (decimal?)(lp.PrecioUnitario * lp.Cantidad)) ?? 0
                })
                .OrderByDescending(c => c.TotalComprado)
                .ToListAsync();
        }

        public async Task GuardarAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
