import { api } from "./api";

export const stockService = {
	async ingresar(variacionId: number, cantidad: number): Promise<void> {
		await api.post("/Stock/ingreso", { variacionId, cantidad });
	},

	async registrarPerdida(variacionId: number, cantidad: number): Promise<void> {
		await api.post("/Stock/perdida", { variacionId, cantidad });
	},
};
