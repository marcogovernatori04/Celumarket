export interface CelularListado {
	id: number;
	marca: string;
	modelo: string;
	precioMinimo: number;
	cantidadColores: number;
	stockTotal: number;
	urlImagenPrincipal: string;
}

export interface RespuestaPaginadaCelulares {
	items: CelularListado[];
	totalItems: number;
	paginaActual: number;
	totalPaginas: number;
}
