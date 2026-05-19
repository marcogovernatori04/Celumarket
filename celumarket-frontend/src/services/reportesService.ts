import { api } from "./api";

export type DashboardReporte = {
	totalClientes: number;
	pedidosPendientes: number;
	productosSinStock: number;
	totalPedidos: number;
	recaudacionProductos: number;
	recaudacionEnvios: number;
	recaudacionTotal: number;
};

export type TopVendidoReporte = {
	marca: string;
	modelo: string;
	cantidadVendida: number;
	totalRecaudado: number;
};

export type StockCriticoReporte = {
	variacionId: number;
	marcaModelo: string;
	precio: number;
	stockActual: number;
};

export type FacturacionDiariaReporte = {
	fecha: string;
	cantidadPedidos: number;
	totalProductos: number;
	totalEnvio: number;
	totalFacturado: number;
};

export const reportesService = {
	async obtenerDashboard(): Promise<DashboardReporte> {
		const { data } = await api.get<DashboardReporte>("/Reportes/dashboard");
		return data;
	},

	async obtenerTopVendidos(): Promise<TopVendidoReporte[]> {
		const { data } = await api.get<TopVendidoReporte[]>("/Reportes/top-vendidos");
		return data;
	},

	async obtenerStockCritico(umbral = 5): Promise<StockCriticoReporte[]> {
		const { data } = await api.get<StockCriticoReporte[]>("/Reportes/stock-critico", {
			params: { umbral },
		});
		return data;
	},

	async obtenerFacturacion30D(): Promise<FacturacionDiariaReporte[]> {
		const { data } = await api.get<FacturacionDiariaReporte[]>("/Reportes/facturacion-30d");
		return data;
	},

	async obtenerFacturacionMes(anio: number, mes: number): Promise<FacturacionDiariaReporte[]> {
		const { data } = await api.get<FacturacionDiariaReporte[]>("/Reportes/facturacion-mes", {
			params: { anio, mes },
		});
		return data;
	},
};
