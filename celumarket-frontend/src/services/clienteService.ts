import { api } from "./api";

export type MiPerfil = {
	nombreCompleto: string;
	email?: string;
	telefono?: string;
	dni?: string;
	direccionCompleta?: string | null;
	codigoPostalDireccion?: number | null;
};

export const clienteService = {
	async obtenerMiPerfil(): Promise<MiPerfil> {
		const { data } = await api.get<MiPerfil>("/Clientes/mi-perfil");
		return data;
	},
};
