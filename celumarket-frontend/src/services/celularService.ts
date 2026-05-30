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

	configurarDestacado: async (
		celularId: number,
		payload: { esDestacado: boolean; textoPromocion?: string | null },
	): Promise<void> => {
		await api.put(`/Celulares/${celularId}/destacado`, payload);
	},

	obtenerDetalle: async (celularId: number): Promise<CelularDetalle> => {
		const respuesta = await api.get<CelularDetalle>(`/Celulares/${celularId}`);
		return respuesta.data;
	},

	modificarVariacion: async (payload: {
		variacionId: number;
		colorId: number;
		precio: number;
		precioAnterior?: number | null;
		almacenamiento: string;
	}): Promise<void> => {
		await api.put(`/Celulares/variaciones/${payload.variacionId}`, payload);
	},

	eliminarVariacion: async (variacionId: number): Promise<void> => {
		await api.delete(`/Celulares/variaciones/${variacionId}`);
	},

	eliminarCelular: async (celularId: number): Promise<void> => {
		await api.delete(`/Celulares/${celularId}`);
	},

	modificarCelular: async (payload: {
		id: number;
		marca: string;
		modelo: string;
		descripcion: string;
	}): Promise<void> => {
		await api.put("/Celulares", payload);
	},

	reemplazarEspecificaciones: async (
		celularId: number,
		especificaciones: Array<{ nombre: string; valor: string }>,
	): Promise<void> => {
		await api.put(`/Celulares/${celularId}/especificaciones`, especificaciones);
	},

	subirImagenVariacion: async (variacionId: number, archivo: File, esPrincipal = false): Promise<void> => {
		const formData = new FormData();
		formData.append("archivo", archivo);
		formData.append("esPrincipal", String(esPrincipal));
		await api.post(`/Celulares/variaciones/${variacionId}/imagenes`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
	},

	eliminarImagenVariacion: async (variacionId: number, url: string): Promise<void> => {
		await api.delete(`/Celulares/variaciones/${variacionId}/imagenes`, { params: { url } });
	},

	crearCelular: async (payload: {
		marca: string;
		modelo: string;
		descripcion: string;
	}): Promise<number> => {
		const { data } = await api.post<{ celularId: number; CelularId?: number; Mensaje?: string }>("/Celulares", payload);
		return data.celularId ?? data.CelularId ?? 0;
	},

	agregarVariacion: async (payload: {
		celularId: number;
		colorId: number;
		precio: number;
		precioAnterior?: number | null;
		almacenamiento: string;
		stockInicial: number;
	}): Promise<number> => {
		const { data } = await api.post<{ variacionId: number; VariacionId?: number }>("/Celulares/variacion", payload);
		return data.variacionId ?? data.VariacionId ?? 0;
	},
};
