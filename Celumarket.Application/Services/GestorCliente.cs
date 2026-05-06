using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;

namespace Celumarket.Application.Services
{
    public class GestorCliente : IGestorCliente
    {
        private readonly IClienteRepository _clienteRepo;
        private readonly IUsuarioRepository _usuarioRepo;
        private readonly IRolRepository _rolRepo;
        private readonly IServicioSeguridad _servicioSeguridad;
        private readonly IUnitOfWork _unitOfWork;

        public GestorCliente(IClienteRepository clienteRepo, IUsuarioRepository usuarioRepo, IRolRepository rolRepo, IServicioSeguridad servicioSeguridad, IUnitOfWork unitOfWork)
        {
            _clienteRepo = clienteRepo;
            _usuarioRepo = usuarioRepo;
            _rolRepo = rolRepo;
            _servicioSeguridad = servicioSeguridad;
            _unitOfWork = unitOfWork;
        }

        public async Task<int> RegistrarClienteAsync(ClienteDTOs.RegistrarClienteDTO dto)
        {
            var existeEmail = await _usuarioRepo.ObtenerPorEmailAsync(dto.Email);
            if (existeEmail != null)
                throw new Exception("El email ya está registrado");

            var existeDni = await _clienteRepo.ObtenerPorDniAsync(dto.Dni);
            if (existeDni != null)
                throw new Exception("El DNI ya está registrado");

            string hash = _servicioSeguridad.EncriptarPassword(dto.Password);

            // buscamos el nombre del rol "Cliente" para asignarlo al nuevo usuario
            var rolCliente = await _rolRepo.ObtenerPorNombreAsync("Cliente");
            if (rolCliente == null)
                throw new Exception("Rol 'Cliente' no encontrado");

            // creamos el usuario asociado al cliente
            var nuevoUsuario = new Usuario(dto.Email, hash, rolCliente.Id);

            await _usuarioRepo.AgregarAsync(nuevoUsuario);
            await _unitOfWork.GuardarAsync();

            var direccion = new Direccion(
                dto.Calle, dto.Numero, dto.PisoDepto, dto.Localidad, dto.Provincia, dto.CodigoPostal);

            // creamos el cliente con el Id del usuario recién creado
            var cliente = new Cliente(dto.Nombre, dto.Apellido, dto.Dni, dto.Telefono, direccion, nuevoUsuario.Id);

            await _clienteRepo.AgregarAsync(cliente);
            await _unitOfWork.GuardarAsync();

            return cliente.Id;
        }

        public async Task ActualizarPerfilAsync(ClienteDTOs.ActualizarClienteDTO dto)
        {
            var cliente = await _clienteRepo.ObtenerPorIdAsync(dto.ClienteId);
            if (cliente == null) throw new Exception("Cliente no encontrado");

            var direccion = new Direccion(
                dto.Calle, dto.Numero, dto.PisoDepto, dto.Localidad, dto.Provincia, dto.CodigoPostal);

            cliente.ActualizarDatos(dto.Telefono, direccion);

            await _unitOfWork.GuardarAsync();
        }

        public async Task<ClienteDTOs.ClienteDetalleDTO> ObtenerPerfilAsync(int clienteId)
        {
            var cliente = await _clienteRepo.ObtenerPorIdAsync(clienteId);
            if (cliente == null) throw new Exception("Cliente no encontrado");

            return new ClienteDTOs.ClienteDetalleDTO
            {
                NombreCompleto = $"{cliente.Nombre} {cliente.Apellido}",
                Email = cliente.Usuario.Email,
                Telefono = cliente.Telefono,
                Dni = cliente.Dni
            };
        }

        public async Task<string> LoginAsync(ClienteDTOs.LoginDTO dto)
        {
            var usuario = await _usuarioRepo.ObtenerPorEmailAsync(dto.Email);
            if (usuario == null || !_servicioSeguridad.VerificarPassword(dto.Password, usuario.PasswordHash))
                throw new Exception("Credenciales inválidas");

            return _servicioSeguridad.GenerarToken(usuario);
        }
    }
}

