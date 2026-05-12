import { useEffect, useMemo, useState } from "react";
import { Footer } from "../components/Footer";
import { PorqueElegirnos } from "../components/PorqueElegirnos";
import { celularService } from "../services/celularService";
import { type CelularDetalle } from "../models/CelularDetalle";
import { carritoService } from "../services/carritoService";
import { DetalleGaleria } from "../components/detalle/DetalleGaleria";
import { DetalleInfoPrincipal } from "../components/detalle/DetalleInfoPrincipal";
import { configuracionService } from "../services/configuracionService";
import type { ConfiguracionSistema } from "../models/ConfiguracionSistema";

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
	const [config, setConfig] = useState<ConfiguracionSistema>({
		descuentoTransferencia: 10,
		umbralEnvioGratis: 499999,
		textoBannerHero: "¡Bienvenido!",
	});

	useEffect(() => {
		const cargar = async () => {
			const [data, configActual] = await Promise.all([
				celularService.obtenerDetalle(celularId),
				configuracionService.obtener(),
			]);
			setDetalle(data);
			setConfig(configActual);
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
				<div className="rounded-xl bg-white p-6">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<DetalleGaleria
							imagenesActivas={imagenesActivas}
							imagenActiva={imagenActiva}
							nombre={`${detalle.marca} ${detalle.modelo}`}
							onSetImagenActiva={setImagenActiva}
							onPrev={irImagenAnterior}
							onNext={irImagenSiguiente}
						/>
						<DetalleInfoPrincipal
							detalle={detalle}
							variacionActiva={variacionActiva}
							almacenamientos={almacenamientos}
							almacenamientoSeleccionado={almacenamientoSeleccionado}
							coloresUnicos={coloresUnicos}
							colorSeleccionadoId={colorSeleccionadoId}
							onSelectAlmacenamiento={(alm) => {
								setAlmacenamientoSeleccionado(alm);
								const primeraVariacion = detalle.variaciones.find(
									(v) => v.almacenamiento === alm,
								);
								setColorSeleccionadoId(primeraVariacion?.colorId ?? null);
								setImagenActiva(0);
							}}
							onSelectColor={(colorId) => {
								setColorSeleccionadoId(colorId);
								setImagenActiva(0);
							}}
							onAgregarAlCarrito={agregarAlCarrito}
							mostrarInfoTecnica={false}
							umbralEnvioGratis={config.umbralEnvioGratis}
							descuentoTransferencia={config.descuentoTransferencia}
						/>
					</div>
					<div className="mt-6 rounded-xl border border-[#e6ebf2] bg-[#f8fafc] p-5">
						<h2 className="text-[18px] font-semibold text-[#1e1e1e]">
							Descripción y especificaciones
						</h2>
						<p className="mt-2 text-[14px] leading-relaxed text-[#4b5563]">
							{detalle.descripcion}
						</p>
						<div className="mt-3 grid grid-cols-1 gap-2 text-[14px] text-[#5f6670] sm:grid-cols-2">
							{detalle.especificaciones.map((esp, idx) => (
								<p key={idx}>
									<span className="font-medium text-[#374151]">{esp.nombre}:</span>{" "}
									{esp.valor}
								</p>
							))}
						</div>
					</div>
				</div>
				<PorqueElegirnos />
			</div>
			<Footer />
		</div>
	);
};
