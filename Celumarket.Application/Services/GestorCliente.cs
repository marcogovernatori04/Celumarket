using Celumarket.Application.DTOs;
using Celumarket.Application.Interfaces;
using Celumarket.Application.Interfaces.Repositories;
using Celumarket.Application.Interfaces.Services;
using Celumarket.Domain;

namespace Celumarket.Application.Services
{
    public class GestorCliente : IGestorCliente
    {
        private static readonly Dictionary<string, (int UsuarioId, DateTime ExpiraUtc)> _tokensRecuperacion = new();
        private readonly IClienteRepository _clienteRepo;
        private readonly IUsuarioRepository _usuarioRepo;
        private readonly IRolRepository _rolRepo;
        private readonly IServicioSeguridad _servicioSeguridad;
        private readonly IServicioEmail _servicioEmail;
        private readonly IUnitOfWork _unitOfWork;

        public GestorCliente(
            IClienteRepository clienteRepo,
            IUsuarioRepository usuarioRepo,
            IRolRepository rolRepo,
            IServicioSeguridad servicioSeguridad,
            IServicioEmail servicioEmail,
            IUnitOfWork unitOfWork)
        {
            _clienteRepo = clienteRepo;
            _usuarioRepo = usuarioRepo;
            _rolRepo = rolRepo;
            _servicioSeguridad = servicioSeguridad;
            _servicioEmail = servicioEmail;
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

            var rolCliente = await _rolRepo.ObtenerPorNombreAsync("Cliente");
            if (rolCliente == null)
                throw new Exception("Rol 'Cliente' no encontrado");

            var nuevoUsuario = new Usuario(dto.Email, hash, rolCliente.Id);

            await _usuarioRepo.AgregarAsync(nuevoUsuario);
            await _unitOfWork.GuardarAsync();

            var direccion = new Direccion(
                dto.Calle, dto.Numero, dto.PisoDepto, dto.Localidad, dto.Provincia, dto.CodigoPostal);

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
                Dni = cliente.Dni,
                DireccionCompleta = cliente.Direccion != null
                    ? $"{cliente.Direccion.Calle} {cliente.Direccion.Numero}{(string.IsNullOrWhiteSpace(cliente.Direccion.PisoDepto) ? "" : $" - {cliente.Direccion.PisoDepto}")}, {cliente.Direccion.Localidad}, {cliente.Direccion.Provincia} ({cliente.Direccion.CodigoPostal})"
                    : null,
                CodigoPostalDireccion = cliente.Direccion?.CodigoPostal,
                CalleDireccion = cliente.Direccion?.Calle,
                NumeroDireccion = cliente.Direccion?.Numero,
                PisoDeptoDireccion = cliente.Direccion?.PisoDepto,
                LocalidadDireccion = cliente.Direccion?.Localidad,
                ProvinciaDireccion = cliente.Direccion?.Provincia
            };
        }

        public async Task<string> LoginAsync(ClienteDTOs.LoginDTO dto)
        {
            var usuario = await _usuarioRepo.ObtenerPorEmailAsync(dto.Email);
            if (usuario == null || !_servicioSeguridad.VerificarPassword(dto.Password, usuario.PasswordHash))
                throw new Exception("Credenciales inválidas");

            return _servicioSeguridad.GenerarToken(usuario);
        }

        public async Task CambiarClaveAsync(int usuarioId, ClienteDTOs.CambiarClaveDTO dto)
        {
            var usuario = await _usuarioRepo.ObtenerPorIdAsync(usuarioId);
            if (usuario == null) throw new Exception("Usuario no encontrado.");
            if (!_servicioSeguridad.VerificarPassword(dto.ClaveActual, usuario.PasswordHash))
                throw new Exception("La clave actual es incorrecta.");
            if (string.IsNullOrWhiteSpace(dto.ClaveNueva) || dto.ClaveNueva.Length < 8)
                throw new Exception("La nueva clave debe tener al menos 8 caracteres.");

            usuario.CambiarPassword(_servicioSeguridad.EncriptarPassword(dto.ClaveNueva));
            await _unitOfWork.GuardarAsync();
        }

        public async Task SolicitarRecuperacionClaveAsync(ClienteDTOs.SolicitarRecuperacionClaveDTO dto)
        {
            var usuario = await _usuarioRepo.ObtenerPorEmailAsync(dto.Email);
            if (usuario == null) return;

            var token = Guid.NewGuid().ToString("N");
            _tokensRecuperacion[token] = (usuario.Id, DateTime.UtcNow.AddMinutes(30));

            var nombreDestino = dto.Email;
            var cliente = await _clienteRepo.ObtenerPorUsuarioIdAsync(usuario.Id);
            if (cliente != null)
            {
                nombreDestino = $"{cliente.Nombre} {cliente.Apellido}";
            }

            await _servicioEmail.EnviarTokenRecuperacionClaveAsync(dto.Email, nombreDestino, token);
        }

        public async Task ConfirmarRecuperacionClaveAsync(ClienteDTOs.ConfirmarRecuperacionClaveDTO dto)
        {
            if (!_tokensRecuperacion.TryGetValue(dto.TokenRecuperacion, out var data))
                throw new Exception("Token de recuperación inválido.");
            if (data.ExpiraUtc < DateTime.UtcNow)
            {
                _tokensRecuperacion.Remove(dto.TokenRecuperacion);
                throw new Exception("Token de recuperación vencido.");
            }
            if (string.IsNullOrWhiteSpace(dto.ClaveNueva) || dto.ClaveNueva.Length < 8)
                throw new Exception("La nueva clave debe tener al menos 8 caracteres.");

            var usuario = await _usuarioRepo.ObtenerPorIdAsync(data.UsuarioId);
            if (usuario == null) throw new Exception("Usuario no encontrado.");
            usuario.CambiarPassword(_servicioSeguridad.EncriptarPassword(dto.ClaveNueva));
            _tokensRecuperacion.Remove(dto.TokenRecuperacion);
            await _unitOfWork.GuardarAsync();
        }

        public async Task<int> RegistrarUsuarioInternoAsync(ClienteDTOs.RegistrarUsuarioInternoDTO dto)
        {
            var email = dto.Email?.Trim();
            var rolNombre = dto.Rol?.Trim() ?? "";

            if (string.IsNullOrWhiteSpace(email))
                throw new Exception("El email es obligatorio.");
            if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 8)
                throw new Exception("La clave debe tener al menos 8 caracteres.");

            var rolesPermitidos = new[] { "Ventas", "Soporte" };
            if (!rolesPermitidos.Contains(rolNombre))
                throw new Exception("Rol interno inválido.");

            var existeEmail = await _usuarioRepo.ObtenerPorEmailAsync(email);
            if (existeEmail != null)
                throw new Exception("El email ya está registrado.");

            var rol = await _rolRepo.ObtenerPorNombreAsync(rolNombre);
            if (rol == null)
                throw new Exception($"Rol '{rolNombre}' no encontrado.");

            var usuario = new Usuario(email, _servicioSeguridad.EncriptarPassword(dto.Password), rol.Id);
            await _usuarioRepo.AgregarAsync(usuario);
            await _unitOfWork.GuardarAsync();

            return usuario.Id;
        }

        public async Task<IEnumerable<ClienteDTOs.UsuarioInternoListadoDTO>> ListarUsuariosInternosAsync()
        {
            return await _usuarioRepo.ObtenerInternosAsync();
        }

        public async Task ActualizarRolUsuarioInternoAsync(int usuarioId, ClienteDTOs.ActualizarRolUsuarioInternoDTO dto)
        {
            var rolNombre = dto.Rol?.Trim() ?? "";
            var rolesPermitidos = new[] { "Ventas", "Soporte" };
            if (!rolesPermitidos.Contains(rolNombre))
                throw new Exception("Rol interno inválido.");

            var usuario = await _usuarioRepo.ObtenerPorIdAsync(usuarioId);
            if (usuario == null)
                throw new Exception("Usuario no encontrado.");
            if (usuario.Rol?.Nombre == "Cliente")
                throw new Exception("No se puede modificar el rol de un cliente desde usuarios internos.");
            if (usuario.Rol?.Nombre == "Admin")
                throw new Exception("No se puede modificar el rol Admin desde este panel.");

            var rol = await _rolRepo.ObtenerPorNombreAsync(rolNombre);
            if (rol == null)
                throw new Exception($"Rol '{rolNombre}' no encontrado.");

            usuario.CambiarRol(rol.Id);
            await _unitOfWork.GuardarAsync();
        }
    }
}

