import { api } from "./api";

export type ItemCarrito = {
	variacionId: number;
	marca: string;
	modelo: string;
	color: string;
	cantidad: number;
	precioUnitario: number;
	urlImagen: string;
};

export type CarritoDetalle = {
	id: number;
	clienteId: number;
	items: ItemCarrito[];
	total: number;
};

export const carritoService = {
	async obtener(): Promise<CarritoDetalle> {
		const { data } = await api.get<CarritoDetalle>("/Carrito");
		return data;
	},

	async agregarItem(variacionId: number, cantidad = 1): Promise<void> {
		await api.post("/Carrito/item", { variacionId, cantidad });
	},

	async restarItem(variacionId: number): Promise<void> {
		await api.put(`/Carrito/item/${variacionId}/restar`);
	},

	async eliminarItem(variacionId: number): Promise<void> {
		await api.delete(`/Carrito/item/${variacionId}`);
	},
};
