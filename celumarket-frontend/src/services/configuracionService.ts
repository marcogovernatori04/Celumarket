import { api } from "./api";
import type {
	ActualizarConfiguracionSistema,
	ConfiguracionSistema,
} from "../models/ConfiguracionSistema";

export const configuracionService = {
	obtener: async (): Promise<ConfiguracionSistema> => {
		const { data } = await api.get<ConfiguracionSistema>("/Configuracion");
		return data;
	},

	actualizar: async (
		payload: ActualizarConfiguracionSistema,
	): Promise<ConfiguracionSistema> => {
		const { data } = await api.put<ConfiguracionSistema>(
			"/Configuracion",
			payload,
		);
		return data;
	},

	subirImagenHero: async (archivo: File): Promise<ConfiguracionSistema> => {
		const formData = new FormData();
		formData.append("archivo", archivo);
		const { data } = await api.post<ConfiguracionSistema>(
			"/Configuracion/hero-imagen",
			formData,
		);
		return data;
	},
};

