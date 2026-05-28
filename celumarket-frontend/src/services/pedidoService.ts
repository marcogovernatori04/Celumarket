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
	fecha?: string;
	fechaPedido?: string;
	fechaCreacion?: string;
	montoTotal: number;
	estado?: string;
	estadoPedido?: string;
};

export type AdminPedidoItem = {
	id: number;
	clienteId?: number;
	clienteNombre?: string;
	fecha?: string;
	estado?: string;
	tipoEnvio?: number;
	montoTotal?: number;
};

export type AdminPedidoDetalleLinea = {
	id: number;
	marca?: string;
	modelo?: string;
	color?: string;
	cantidad: number;
	precioUnitario: number;
	subtotal: number;
};

export type AdminPedidoDetalle = {
	id: number;
	clienteId: number;
	estado?: string;
	fecha?: string;
	fechaVencimiento?: string;
	tipoEnvio?: number;
	montoTotal?: number;
	costoEnvio?: number;
	metodoPago?: string | null;
	estadoPago?: string | null;
	envioEstado?: string | null;
	envioFechaDespacho?: string | null;
	envioCodigoSeguimiento?: string | null;
	lineas: AdminPedidoDetalleLinea[];
};

export type AdminEnvioItem = {
	envioId: number;
	pedidoId: number;
	estado: string;
	tipo: string;
	costo: number;
	direccionEntrega: string;
	fechaEstimada?: string;
	fechaDespacho?: string;
	codigoSeguimiento?: string;
};

export type DetallePedidoLinea = {
	id: number;
	marca: string;
	modelo: string;
	color: string;
	urlImagen: string;
	cantidad: number;
	precioUnitario: number;
	subtotal: number;
};

export type DetallePedido = {
	id: number;
	estado: string;
	fecha: string;
	montoTotal: number;
	metodoPago: string;
	tipoEnvio: string;
	costoEnvio: number;
	datosPagoMercadoPago?: {
		paymentIdExterno?: string | null;
		metodoPagoId?: string | null;
		tipoPagoId?: string | null;
		cuotas: number;
		valorCuota?: number | null;
		montoTotalFinal?: number | null;
		montoPagado?: number | null;
		montoNetoRecibido?: number | null;
		fechaAprobacionUtc?: string | null;
	} | null;
	pagosMercadoPago?: Array<{
		paymentIdExterno?: string | null;
		metodoPagoId?: string | null;
		tipoPagoId?: string | null;
		cuotas: number;
		valorCuota?: number | null;
		montoTotalFinal?: number | null;
		montoPagado?: number | null;
		montoNetoRecibido?: number | null;
		fechaAprobacionUtc?: string | null;
	}> | null;
	direccionEntrega?: {
		calle: string;
		numero: string;
		pisoDepto?: string;
		localidad: string;
		provincia: string;
		codigoPostal: number;
	} | null;
	lineas: DetallePedidoLinea[];
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

	async obtenerTodosAdmin(): Promise<AdminPedidoItem[]> {
		const { data } = await api.get<AdminPedidoItem[]>("/Pedidos/todos");
		return data;
	},

	async obtenerDetalleAdmin(pedidoId: number): Promise<AdminPedidoDetalle> {
		const { data } = await api.get<AdminPedidoDetalle>(`/Pedidos/${pedidoId}/detalle-admin`);
		return data;
	},

	async marcarPagadoAdmin(pedidoId: number): Promise<void> {
		await api.put(`/Pedidos/${pedidoId}/pagar`);
	},

	async cancelarAdmin(pedidoId: number): Promise<void> {
		await api.put(`/Pedidos/${pedidoId}/cancelar`);
	},

	async listarEnviosAdmin(): Promise<AdminEnvioItem[]> {
		const { data } = await api.get<AdminEnvioItem[]>("/Envios");
		return data;
	},

	async despacharEnvioAdmin(envioId: number, numeroSeguimiento: string): Promise<void> {
		await api.put(`/Envios/${envioId}/despachar`, { numeroSeguimiento });
	},

	async obtenerDetalleMiPedido(pedidoId: number): Promise<DetallePedido> {
		const { data } = await api.get<DetallePedido>(`/Pedidos/mis-pedidos/${pedidoId}/detalle`);
		return data;
	},

	async descargarFacturaMiPedido(pedidoId: number): Promise<Blob> {
		const { data } = await api.get(`/Pedidos/mis-pedidos/${pedidoId}/factura`, { responseType: "blob" });
		return data as Blob;
	},
};
