import { api } from "./api";

export type MiPerfil = {
	nombreCompleto: string;
	email?: string;
	telefono?: string;
	dni?: string;
	direccionCompleta?: string | null;
	codigoPostalDireccion?: number | null;
	calleDireccion?: string | null;
	numeroDireccion?: string | null;
	pisoDeptoDireccion?: string | null;
	localidadDireccion?: string | null;
	provinciaDireccion?: string | null;
};

export type ActualizarPerfilPayload = {
	telefono: string;
	calle: string;
	numero: string;
	pisoDepto?: string;
	localidad: string;
	provincia: string;
	codigoPostal: number;
};

export type UsuarioListado = {
	id: number;
	nombreCompleto: string;
	email: string;
	rol: string;
	telefono: string;
	calle: string;
	numero: string;
	pisoDepto: string;
	localidad: string;
	provincia: string;
	codigoPostal: number;
	cantidadPedidos: number;
	totalComprado: number;
};

export type RegistrarClientePayload = {
	dni: string;
	nombre: string;
	apellido: string;
	email: string;
	telefono: string;
	calle: string;
	numero: string;
	pisoDepto?: string;
	localidad: string;
	provincia: string;
	codigoPostal: number;
	password: string;
};

export type RegistrarUsuarioInternoPayload = {
	email: string;
	password: string;
	rol: "Ventas" | "Soporte";
};

export type RolUsuarioInterno = "Ventas" | "Soporte";

export type UsuarioInternoListado = {
	id: number;
	email: string;
	rol: string;
};

export const clienteService = {
	async obtenerMiPerfil(): Promise<MiPerfil> {
		const { data } = await api.get<MiPerfil>("/Clientes/mi-perfil");
		return data;
	},

	async actualizarMiPerfil(payload: ActualizarPerfilPayload): Promise<void> {
		await api.put("/Clientes/mi-perfil", payload);
	},

	async obtenerUsuarios(): Promise<UsuarioListado[]> {
		const { data } = await api.get<UsuarioListado[]>("/Clientes/lista-completa");
		return data;
	},

	async registrar(payload: RegistrarClientePayload): Promise<void> {
		await api.post("/Clientes/registrar", payload);
	},

	async registrarUsuarioInterno(payload: RegistrarUsuarioInternoPayload): Promise<void> {
		await api.post("/Clientes/usuarios-internos", payload);
	},

	async obtenerUsuariosInternos(): Promise<UsuarioInternoListado[]> {
		const { data } = await api.get<UsuarioInternoListado[]>("/Clientes/usuarios-internos");
		return data;
	},

	async actualizarRolUsuarioInterno(usuarioId: number, rol: RolUsuarioInterno): Promise<void> {
		await api.put(`/Clientes/usuarios-internos/${usuarioId}/rol`, { rol });
	},

	async eliminarUsuarioInterno(usuarioId: number): Promise<void> {
		await api.delete(`/Clientes/usuarios-internos/${usuarioId}`);
	},
};
