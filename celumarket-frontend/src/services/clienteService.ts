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

export const clienteService = {
	async obtenerMiPerfil(): Promise<MiPerfil> {
		const { data } = await api.get<MiPerfil>("/Clientes/mi-perfil");
		return data;
	},

	async actualizarMiPerfil(payload: ActualizarPerfilPayload): Promise<void> {
		await api.put("/Clientes/mi-perfil", payload);
	},
};
