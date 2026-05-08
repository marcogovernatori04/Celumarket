import { api } from "./api";

export type ReservaCheckout = {
	reservaId: number;
	fechaVencimientoUtc: string;
	segundosRestantes: number;
};

export type MetodoPago = {
	id: number;
	nombre: string;
	minutosPlazo: number;
};

export type DireccionCheckout = {
	calle: string;
	numero: string;
	pisoDepto?: string;
	localidad: string;
	provincia: string;
	codigoPostal: number;
};

export type CheckoutPayload = {
	metodoPagoId: number;
	tipoEnvio: 0 | 1 | 2;
	direccionEntrega?: DireccionCheckout;
};

export type CheckoutResponse = {
	pedidoId: number;
	linkMP?: string | null;
	fechaVencimientoUtc: string;
	mensaje: string;
};

export type MisPedidosItem = {
	id: number;
	fechaPedido?: string;
	fechaCreacion?: string;
	montoTotal: number;
	estado?: string;
	estadoPedido?: string;
};

export const pedidoService = {
	async iniciarCompra(): Promise<ReservaCheckout> {
		const { data } = await api.post<ReservaCheckout>("/Pedidos/iniciar-compra");
		return data;
	},

	async obtenerMetodosPago(): Promise<MetodoPago[]> {
		const { data } = await api.get<MetodoPago[]>("/Pedidos/metodos-pago");
		return data;
	},

	async checkout(payload: CheckoutPayload): Promise<CheckoutResponse> {
		const { data } = await api.post<CheckoutResponse>("/Pedidos/checkout", payload);
		return data;
	},

	async obtenerMisPedidos(): Promise<MisPedidosItem[]> {
		const { data } = await api.get<MisPedidosItem[]>("/Pedidos/mis-pedidos");
		return data;
	},
};
