import { api } from "./api";

type MiPerfil = {
	nombreCompleto: string;
	direccionCompleta?: string | null;
	codigoPostalDireccion?: number | null;
};

export const clienteService = {
	async obtenerMiPerfil(): Promise<MiPerfil> {
		const { data } = await api.get<MiPerfil>("/Clientes/mi-perfil");
		return data;
	},
};
