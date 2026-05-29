import { useEffect, useState } from "react";
import {
	TarjetaCelular,
	type ProductoCelular,
} from "../components/TarjetaCelular";
import { Footer } from "../components/Footer";
import { PorqueElegirnos } from "../components/PorqueElegirnos";
import { celularService } from "../services/celularService";
import { configuracionService } from "../services/configuracionService";
import type { ConfiguracionSistema } from "../models/ConfiguracionSistema";
import { twBase } from "../styles/tw";

type LandingProps = {
	onIrATienda?: () => void;
	onVerDetalle?: (celularId: number) => void;
};

export const Landing = ({ onIrATienda, onVerDetalle }: LandingProps) => {
	const [productos, setProductos] = useState<ProductoCelular[]>([]);
	const [cargando, setCargando] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [indiceDestacado, setIndiceDestacado] = useState(0);
	const [animacionEntrada, setAnimacionEntrada] = useState<"left" | "right">("right");
	const [config, setConfig] = useState<ConfiguracionSistema>({
		descuentoTransferencia: 10,
		umbralEnvioGratis: 499999,
		textoBannerHero: "¡Bienvenido!",
		aliasTransferencia: "celumarket",
		cbuTransferencia: "0000003100000000000000",
		titularTransferencia: "Celumarket S.A.",
		bancoTransferencia: "Banco Nación",
	});

	useEffect(() => {
		const obtenerProductos = async () => {
			try {
				const datos = await celularService.obtenerDestacados(4);

				try {
					const configActual = await configuracionService.obtener();
					setConfig(configActual);
				} catch {
					setConfig((prev) => ({
						...prev,
						textoBannerHero: prev.textoBannerHero?.trim() || "¡Bienvenido!",
					}));
				}

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

	const irAnterior = () => {
		setAnimacionEntrada("left");
		setIndiceDestacado((actual) =>
			productos.length === 0 ? 0 : (actual - 1 + productos.length) % productos.length,
		);
	};

	const irSiguiente = () => {
		setAnimacionEntrada("right");
		setIndiceDestacado((actual) =>
			productos.length === 0 ? 0 : (actual + 1) % productos.length,
		);
	};

	return (
		<div className={`${twBase.pageLayout} flex flex-col`}>
			<section className="flex flex-col items-center justify-center bg-gradient-to-r from-[#001830] to-[#0a0a0a] px-4 py-14 text-white sm:px-6 sm:py-16 lg:py-20">
				<h1 className="mb-3 text-center text-[2.35rem] font-bold tracking-tight sm:mb-4 sm:text-5xl lg:text-6xl">
					Celumarket
				</h1>
				<p className="mb-7 text-lg text-gray-300 sm:mb-8 sm:text-xl lg:text-2xl">Tu lugar móvil</p>
				<button onClick={onIrATienda} className="rounded-md bg-[#015cb9] px-10 py-3 text-lg font-medium text-white transition-transform transition-colors duration-200 hover:scale-105 hover:bg-[#017AF4] active:scale-100 sm:px-14 sm:text-xl">
					Ir a la tienda
				</button>
			</section>

			<div className="bg-[#015cb9] py-2 text-center text-sm font-medium tracking-wide text-white sm:text-base">
				{config.textoBannerHero?.trim() || "¡Bienvenido!"}
			</div>

			<section className="flex-grow bg-[#F5F5F5] px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
				<h2 className="mb-7 text-center text-[1.75rem] font-bold tracking-tight text-slate-900 sm:mb-9 sm:text-[2rem] lg:mb-10 lg:text-3xl">
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
					<div className="mx-auto w-full max-w-[1240px]">
						<div className="mx-auto grid w-full max-w-[420px] grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2 md:hidden">
							<button
								type="button"
								aria-label="Destacado anterior"
								onClick={irAnterior}
								className="inline-flex h-10 w-10 items-center justify-center justify-self-center rounded-full border border-[#cdd6e1] bg-white text-[#001830] shadow-sm transition-colors hover:bg-[#eef3f8]"
							>
								‹
							</button>
							<div className="flex justify-center pb-2">
								{productos[indiceDestacado] && (
									<div
										key={`${productos[indiceDestacado].id}-${indiceDestacado}`}
										className={animacionEntrada === "right" ? "animate-[carouselInRight_280ms_ease-out]" : "animate-[carouselInLeft_280ms_ease-out]"}
									>
										<TarjetaCelular
											producto={productos[indiceDestacado]}
											umbralEnvioGratis={config.umbralEnvioGratis}
											descuentoTransferencia={config.descuentoTransferencia}
											onClick={() => onVerDetalle?.(productos[indiceDestacado].id)}
										/>
									</div>
								)}
							</div>
							<button
								type="button"
								aria-label="Siguiente destacado"
								onClick={irSiguiente}
								className="inline-flex h-10 w-10 items-center justify-center justify-self-center rounded-full border border-[#cdd6e1] bg-white text-[#001830] shadow-sm transition-colors hover:bg-[#eef3f8]"
							>
								›
							</button>
						</div>
						<div className="hidden grid-cols-2 gap-5 md:grid lg:grid-cols-4 lg:gap-6">
							{productos.map((producto) => (
								<TarjetaCelular
									key={producto.id}
									producto={producto}
									umbralEnvioGratis={config.umbralEnvioGratis}
									descuentoTransferencia={config.descuentoTransferencia}
									onClick={() => onVerDetalle?.(producto.id)}
								/>
							))}
						</div>
					</div>
				)}

				<PorqueElegirnos />
			</section>

			<Footer />
		</div>
	);
};
