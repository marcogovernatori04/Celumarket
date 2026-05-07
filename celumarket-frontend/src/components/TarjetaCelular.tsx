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
};

export const TarjetaCelular = ({ producto, onClick }: TarjetaCelularProps) => {
	return (
		<div
			onClick={onClick}
			className="group bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col w-[280px] cursor-pointer"
		>
			<div className="relative bg-[#f0f0f0] rounded-lg mb-3 flex items-center justify-center h-[260px] overflow-hidden">
				{producto.etiquetaPromo && (
					<span className="absolute left-2 top-2 z-10 rounded-full bg-[#dbe9ff] px-2 py-1 text-[11px] font-semibold text-[#0b3f75]">
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
				<span className="text-2xl font-bold text-slate-900">
					${producto.precio.toLocaleString("es-AR")}
				</span>
				{producto.precioAnterior &&
					producto.precioAnterior > producto.precio && (
						<span className="text-sm text-gray-400 line-through ml-2">
							${producto.precioAnterior.toLocaleString("es-AR")}
						</span>
					)}
			</div>

			{producto.precio >= 499999 ? (
				<span className="mt-1 inline-flex w-fit rounded-full bg-green-100 px-2 py-1 text-[12px] font-semibold text-green-700">
					Envío gratis
				</span>
			) : (
				<span
					aria-hidden="true"
					className="mt-1 inline-flex w-fit rounded-full px-2 py-1 text-[11px] font-semibold invisible"
				>
					Envío gratis
				</span>
			)}

			<div className="mt-auto pt-2">
				<p className="text-xs text-gray-500 mt-1">
					{producto.colores} colores
				</p>

				<p className="text-xs text-[#4b6b91] mt-1">
					10% descuento efectivo/transferencia
				</p>
			</div>
		</div>
	);
};
