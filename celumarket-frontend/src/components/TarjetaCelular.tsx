import { twCatalogo } from "../styles/tw";

export interface ProductoCelular {
	id: number;
	nombre: string;
	precio: number;
	precioAnterior?: number | null;
	colores: number;
	imagen: string;
	etiquetaPromo?: string;
	descuentoTexto?: string;
}

export interface ProductoBackendDTO {
	id: number;
	marca: string;
	modelo: string;
	precio: number;
	precioAnterior?: number | null;
	cantidadColores: number;
	textoPromocion?: string | null;
	urlImagenPrincipal: string;
}

type TarjetaCelularProps = {
	producto: ProductoCelular;
	onClick?: () => void;
	umbralEnvioGratis?: number;
	descuentoTransferencia?: number;
};

export const TarjetaCelular = ({
	producto,
	onClick,
	umbralEnvioGratis = 499999,
	descuentoTransferencia = 10,
}: TarjetaCelularProps) => {
	return (
		<div
			onClick={onClick}
			className={twCatalogo.productCard}
		>
			<div className={twCatalogo.productImageWrap}>
				{producto.etiquetaPromo && (
					<span className={twCatalogo.productPromoTag}>
						{producto.etiquetaPromo}
					</span>
				)}
				<img
					src={producto.imagen}
					alt={producto.nombre}
					className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 scale-[1.40] group-hover:scale-[1.45]"
				/>
			</div>

			<h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-[#015cb9] transition-colors duration-300 truncate">
				{producto.nombre}
			</h3>

			<div className="flex items-baseline mt-2 mb-1">
				<span className={twCatalogo.productPrice}>
					${producto.precio.toLocaleString("es-AR")}
				</span>
				{producto.precioAnterior &&
					producto.precioAnterior > producto.precio && (
						<span className={twCatalogo.productOldPrice}>
							${producto.precioAnterior.toLocaleString("es-AR")}
						</span>
					)}
			</div>

			{producto.precio >= umbralEnvioGratis ? (
				<span className={twCatalogo.productShippingFree}>
					Envío gratis
				</span>
			) : (
				<span
					aria-hidden="true"
					className={twCatalogo.productShippingPlaceholder}
				>
					Envío gratis
				</span>
			)}

			<div className="mt-auto pt-2">
				<p className="text-xs text-gray-500 mt-1">
					{producto.colores} colores
				</p>

				<p className="text-xs text-[#4b6b91] mt-1">
					{descuentoTransferencia}% descuento efectivo/transferencia
				</p>
			</div>
		</div>
	);
};
