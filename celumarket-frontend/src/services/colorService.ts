import { api } from "./api";

export type ColorItem = {
	id: number;
	nombre: string;
	hex: string;
};

export const colorService = {
	async listarActivos(): Promise<ColorItem[]> {
		const { data } = await api.get<ColorItem[]>("/Colores");
		return data;
	},

	async crear(nombre: string, hex: string): Promise<number> {
		const { data } = await api.post<{ colorId: number; ColorId?: number }>("/Colores", { nombre, hex });
		return data.colorId ?? data.ColorId ?? 0;
	},
};
