export type CelularDestacado = {
	id: number;
	marca: string;
	modelo: string;
	precio: number;
	precioAnterior?: number | null;
	cantidadColores: number;
	textoPromocion?: string | null;
	urlImagenPrincipal: string;
};

export type EspecificacionDetalle = {
	nombre: string;
	valor: string;
};

export type VariacionDetalle = {
	id: number;
	color: string;
	colorId: number;
	colorHex?: string | null;
	precio: number;
	precioAnterior?: number | null;
	almacenamiento: string;
	stock: number;
	imagenes: string[];
};

export type CelularDetalle = {
	id: number;
	marca: string;
	modelo: string;
	descripcion: string;
	textoPromocion?: string | null;
	especificaciones: EspecificacionDetalle[];
	variaciones: VariacionDetalle[];
};
