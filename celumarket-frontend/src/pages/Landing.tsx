import { useState, useEffect } from "react";
import {
	TarjetaCelular,
	type ProductoBackendDTO,
	type ProductoCelular,
} from "../components/TarjetaCelular";
import { Footer } from "../components/Footer";
import { PorqueElegirnos } from "../components/PorqueElegirnos";

type LandingProps = {
	onIrATienda?: () => void;
	onVerDetalle?: (celularId: number) => void;
};

export const Landing = ({ onIrATienda, onVerDetalle }: LandingProps) => {
	const [productos, setProductos] = useState<ProductoCelular[]>([]);
	const [cargando, setCargando] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const textoBannerPromocional = "¡Bienvenido!";

	useEffect(() => {
		const obtenerProductos = async () => {
			try {
				const respuesta = await fetch(
					"https://jl5zhbmj-7119.brs.devtunnels.ms/api/Celulares/destacados?cantidad=4",
				);

				if (!respuesta.ok) {
					throw new Error("No se pudieron cargar los productos");
				}

				const datos: ProductoBackendDTO[] = await respuesta.json();
				const productosMapeados: ProductoCelular[] = datos.map((item) => ({
					id: item.id,
					nombre: `${item.marca} ${item.modelo}`.trim(),
					precio: item.precio,
					precioAnterior: item.precioAnterior ?? null,
					colores: item.cantidadColores,
					imagen:
						item.urlImagenPrincipal ||
						"https://res.cloudinary.com/dwpglezcz/image/upload/v1777936971/crszqlfthzt0xxhy1yj4.avif",
					etiquetaPromo: item.textoPromocion ?? undefined,
					descuentoTexto:
						item.precioAnterior && item.precioAnterior > item.precio
							? `${Math.round(
									((item.precioAnterior - item.precio) /
										item.precioAnterior) *
										100,
								)}% descuento efec./trans.`
							: undefined,
				}));

				setProductos(productosMapeados);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error desconocido");
			} finally {
				setCargando(false);
			}
		};

		obtenerProductos();
	}, []);

	return (
		<div className="flex flex-col min-h-screen">
			<section className="bg-gradient-to-r from-[#001830] to-[#0a0a0a] text-white flex flex-col items-center justify-center py-20 px-4">
				<h1 className="text-6xl font-bold mb-4 tracking-tight">
					Celumarket
				</h1>
				<p className="text-2xl text-gray-300 mb-8">Tu lugar móvil</p>
				<button onClick={onIrATienda} className="bg-[#015cb9] hover:bg-blue-700 hover:scale-105 active:scale-100 text-white font-medium py-3 px-14 rounded-md transition-transform transition-colors duration-200 text-xl">
					Ir a la tienda
				</button>
			</section>

			<div className="bg-[#015cb9] text-white text-center py-2 font-medium tracking-wide">
				{textoBannerPromocional}
			</div>

			<section className="py-16 px-10 bg-[#F5F5F5] flex-grow">
				<h2 className="text-3xl font-bold text-center text-slate-900 mb-10 tracking-tight">
					Destacados
				</h2>

				{cargando && (
					<p className="text-center text-gray-500 font-bold">
						Cargando celulares desde el servidor...
					</p>
				)}
				{error && (
					<p className="text-center text-red-500 font-bold">
						Error: {error}
					</p>
				)}

				{!cargando && !error && (
					<div className="flex justify-center gap-6 flex-wrap">
						{productos.map((prod) => (
							<TarjetaCelular key={prod.id} producto={prod} onClick={() => onVerDetalle?.(prod.id)} />
						))}
					</div>
				)}

				<PorqueElegirnos />
			</section>

			<Footer />
		</div>
	);
};
