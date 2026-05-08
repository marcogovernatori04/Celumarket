import { useEffect, useMemo, useState } from "react";
import { Footer } from "../components/Footer";
import { PorqueElegirnos } from "../components/PorqueElegirnos";
import { celularService } from "../services/celularService";
import { type CelularDetalle } from "../models/CelularDetalle";
import { carritoService } from "../services/carritoService";

type DetalleProps = {
	celularId: number;
	onRequiereLogin?: () => void;
	onAgregadoCarrito?: (mensaje: string) => Promise<void> | void;
};

export const DetalleCelular = ({
	celularId,
	onRequiereLogin,
	onAgregadoCarrito,
}: DetalleProps) => {
	const [detalle, setDetalle] = useState<CelularDetalle | null>(null);
	const [almacenamientoSeleccionado, setAlmacenamientoSeleccionado] =
		useState("");
	const [colorSeleccionadoId, setColorSeleccionadoId] = useState<
		number | null
	>(null);
	const [imagenActiva, setImagenActiva] = useState(0);

	useEffect(() => {
		const cargar = async () => {
			const data = await celularService.obtenerDetalle(celularId);
			setDetalle(data);
			const primerAlmacenamiento = data.variaciones[0]?.almacenamiento ?? "";
			const primerColorId =
				data.variaciones.find(
					(v) => v.almacenamiento === primerAlmacenamiento,
				)?.colorId ?? null;
			setAlmacenamientoSeleccionado(primerAlmacenamiento);
			setColorSeleccionadoId(primerColorId);
			setImagenActiva(0);
		};
		void cargar();
	}, [celularId]);

	const almacenamientos = useMemo(
		() =>
			detalle
				? [...new Set(detalle.variaciones.map((v) => v.almacenamiento))]
				: [],
		[detalle],
	);

	const variacionesPorAlmacenamiento = useMemo(
		() =>
			detalle
				? detalle.variaciones.filter(
						(v) => v.almacenamiento === almacenamientoSeleccionado,
					)
				: [],
		[detalle, almacenamientoSeleccionado],
	);

	const variacionActiva = useMemo(
		() =>
			variacionesPorAlmacenamiento.find(
				(v) => v.colorId === colorSeleccionadoId,
			) ?? variacionesPorAlmacenamiento[0],
		[variacionesPorAlmacenamiento, colorSeleccionadoId],
	);

	const imagenesActivas = variacionActiva?.imagenes ?? [];
	const coloresUnicos = useMemo(
		() =>
			variacionesPorAlmacenamiento
				? Array.from(
						new Map(
							variacionesPorAlmacenamiento.map((v) => [v.colorId, v]),
						).values(),
					)
				: [],
		[variacionesPorAlmacenamiento],
	);

	const irImagenAnterior = () => {
		if (imagenesActivas.length <= 1) return;
		setImagenActiva((prev) =>
			prev === 0 ? imagenesActivas.length - 1 : prev - 1,
		);
	};

	const irImagenSiguiente = () => {
		if (imagenesActivas.length <= 1) return;
		setImagenActiva((prev) =>
			prev === imagenesActivas.length - 1 ? 0 : prev + 1,
		);
	};

	const agregarAlCarrito = async () => {
		if (!variacionActiva) return;
		try {
			await carritoService.agregarItem(variacionActiva.id, 1);
			await onAgregadoCarrito?.("Producto agregado al carrito");
		} catch {
			onRequiereLogin?.();
		}
	};

	if (!detalle || !variacionActiva) {
		return (
			<div className="min-h-screen bg-[#f5f5f5] p-10 text-center text-gray-600">
				Cargando detalle...
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#f5f5f5]">
			<div className="mx-auto max-w-6xl px-9 py-7">
				<div className="mb-6 flex justify-center">
					<div className="relative w-full max-w-[420px]">
						<input
							placeholder="Buscar..."
							className="h-10 w-full rounded-full border border-[#d9d9d9] bg-white pl-4 pr-10 text-sm text-[#1e1e1e] outline-none"
						/>
						<span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
							⌕
						</span>
					</div>
				</div>
				<div className="rounded-xl bg-white p-8">
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
						<div className="relative flex items-center justify-center rounded-xl bg-[#f0f0f0] p-4 min-h-[350px]">
							<img
								key={imagenesActivas[imagenActiva] ?? "placeholder"}
								src={
									imagenesActivas[imagenActiva] ??
									"https://placehold.co/500x500"
								}
								alt={`${detalle.marca} ${detalle.modelo}`}
								className="max-h-[360px] w-auto scale-[1.28] object-contain mix-blend-multiply animate-[fadeIn_260ms_ease-out]"
							/>
							{imagenesActivas.length > 1 && (
								<>
									<button
										onClick={irImagenAnterior}
										className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-1 text-lg text-[#001830] shadow transition-all duration-200 hover:scale-110 hover:bg-white hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#015cb9]"
									>
										‹
									</button>
									<button
										onClick={irImagenSiguiente}
										className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-1 text-lg text-[#001830] shadow transition-all duration-200 hover:scale-110 hover:bg-white hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#015cb9]"
									>
										›
									</button>
								</>
							)}
							{imagenesActivas.length > 1 && (
								<div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
									{imagenesActivas.map((_, idx) => (
										<button
											key={idx}
											onClick={() => setImagenActiva(idx)}
											className={`h-2.5 w-2.5 rounded-full ${idx === imagenActiva ? "bg-[#015cb9]" : "bg-[#b9c3d1]"}`}
										/>
									))}
								</div>
							)}
						</div>
						<div>
							<h1 className="text-[34px] leading-tight font-semibold text-[#1e1e1e]">
								{detalle.marca} {detalle.modelo}
							</h1>
							<p className="mt-2 text-[46px] leading-none font-bold text-[#1e1e1e]">
								${variacionActiva.precio.toLocaleString("es-AR")}
							</p>
							{variacionActiva.precio >= 499999 && (
								<span className="mt-3 inline-flex w-fit rounded-full bg-[#E7F7EE] px-3 py-1.5 text-[14px] font-semibold text-[#1E8E5A]">
									Envío gratis
								</span>
							)}
							{detalle.textoPromocion && (
								<p className="mt-3 inline-flex rounded-full bg-[#dbe9ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#0b3f75]">
									{detalle.textoPromocion}
								</p>
							)}
							<p className="mt-3 text-sm text-[#4b6b91]">
								10% descuento efectivo/transferencia
							</p>
							<p className="mt-1 text-sm text-[#4b6b91]">
								Hasta 12 cuotas con tarjeta de crédito/débito
							</p>
							<div className="mt-4 space-y-1 text-[18px] leading-tight text-[#757575]">
								{detalle.especificaciones.map((esp, idx) => (
									<p key={idx}>
										• {esp.nombre}: {esp.valor}
									</p>
								))}
							</div>
							<div className="mt-5">
								<p className="mb-2 text-sm font-medium text-[#1e1e1e]">
									Almacenamiento
								</p>
								<div className="mb-4 flex flex-wrap gap-2.5">
									{almacenamientos.map((alm) => {
										const activo = almacenamientoSeleccionado === alm;
										return (
											<button
												key={alm}
												type="button"
												onClick={() => {
													setAlmacenamientoSeleccionado(alm);
													const primeraVariacion =
														detalle?.variaciones.find(
															(v) => v.almacenamiento === alm,
														);
													setColorSeleccionadoId(
														primeraVariacion?.colorId ?? null,
													);
													setImagenActiva(0);
												}}
												className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${activo ? "bg-[#015cb9] text-white" : "bg-[#eef2f7] text-[#4b5563] hover:bg-[#dbe5f1]"}`}
											>
												{alm}
											</button>
										);
									})}
								</div>
								<p className="mb-2 text-sm font-medium text-[#1e1e1e]">
									Colores
								</p>
								<div className="flex flex-wrap items-center gap-2">
									{coloresUnicos.map((variacion) => {
										const activo =
											colorSeleccionadoId === variacion.colorId;
										const esBlanco =
											(variacion.colorHex ?? "").toLowerCase() ===
												"#f5f5f5" ||
											(variacion.colorHex ?? "").toLowerCase() ===
												"#ffffff";
										return (
											<button
												key={variacion.colorId}
												type="button"
												onClick={() => {
													setColorSeleccionadoId(
														variacion.colorId,
													);
													setImagenActiva(0);
												}}
												title={variacion.color}
												aria-label={`Color ${variacion.color}`}
												className={`h-9 w-9 rounded-full border-2 transition-all duration-200 ${activo ? "border-[#015cb9] scale-110 shadow-md" : esBlanco ? "border-[#cfd4dc] hover:scale-105 hover:shadow" : "border-white hover:scale-105 hover:shadow"}`}
												style={{
													backgroundColor:
														variacion.colorHex ?? "#6b7280",
												}}
											/>
										);
									})}
								</div>
								<p className="mt-2 text-xs text-[#6b7280]">
									{variacionActiva.color}
								</p>
							</div>
							<button
								onClick={agregarAlCarrito}
								className="mt-5 h-11 w-full rounded-md bg-[#015cb9] text-sm font-medium text-white hover:bg-[#017AF4] transition-colors duration-200"
							>
								Agregar al carrito
							</button>
						</div>
					</div>
				</div>
				<PorqueElegirnos />
			</div>
			<Footer />
		</div>
	);
};
