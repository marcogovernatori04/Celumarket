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
};
