import { api } from "./api";

export type TarifaPorCodigoPostal = {
	codigoPostal: number;
	precioDomicilio: number;
	precioSucursal: number;
	diasDemora: number;
};

export const tarifaService = {
	async obtenerPorCodigoPostal(codigoPostal: number): Promise<TarifaPorCodigoPostal> {
		const { data } = await api.get<TarifaPorCodigoPostal>(`/TarifasZonales/${codigoPostal}`);
		return data;
	},
};
