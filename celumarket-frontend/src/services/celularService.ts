import { api } from "./api";
import { type CelularListado, type RespuestaPaginadaCelulares } from "../models/Celular";
import { type CelularDestacado, type CelularDetalle } from "../models/CelularDetalle";

export const celularService = {
	obtenerCatalogo: async (): Promise<CelularListado[]> => {
		const respuesta = await api.get<RespuestaPaginadaCelulares>("/Celulares");
		return respuesta.data.items;
	},

	obtenerCatalogoPaginado: async (
		pag: number,
		cant: number,
	): Promise<RespuestaPaginadaCelulares> => {
		const respuesta = await api.get<RespuestaPaginadaCelulares>(
			`/Celulares?pag=${pag}&cant=${cant}`,
		);
		return respuesta.data;
	},

	obtenerDestacados: async (cantidad = 4): Promise<CelularDestacado[]> => {
		const respuesta = await api.get<CelularDestacado[]>(
			`/Celulares/destacados?cantidad=${cantidad}`,
		);
		return respuesta.data;
	},

	obtenerDetalle: async (celularId: number): Promise<CelularDetalle> => {
		const respuesta = await api.get<CelularDetalle>(`/Celulares/${celularId}`);
		return respuesta.data;
	},
};
