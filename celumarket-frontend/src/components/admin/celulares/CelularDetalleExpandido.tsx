import type { CelularDetalle } from "../../../models/CelularDetalle";
import type { ColorItem } from "../../../services/colorService";
import { DescripcionEditor } from "./DescripcionEditor";
import { EspecificacionesEditor } from "./EspecificacionesEditor";
import { VariacionRowEditor } from "./VariacionRowEditor";
import { ColorSelector } from "./ColorSelector";
import { useState } from "react";

type CelularDetalleExpandidoProps = {
	detalle: CelularDetalle;
	onGuardarDescripcion: (detalle: CelularDetalle, descripcion: string) => Promise<void>;
	onGuardarEspecificaciones: (detalle: CelularDetalle, especificaciones: Array<{ nombre: string; valor: string }>) => Promise<void>;
	onGuardarVariacion: (payload: {
		variacionId: number;
		colorId: number;
		precio: number;
		precioAnterior?: number | null;
		almacenamiento: string;
	}) => Promise<void>;
	onAjustarStock: (variacionId: number, cantidad: number, tipo: "ingreso" | "perdida") => Promise<void>;
	onSubirImagen: (variacionId: number, archivo: File) => Promise<void>;
	onEliminarImagen: (variacionId: number, url: string) => Promise<void>;
	onEliminarVariacion: (variacionId: number) => Promise<void>;
	colores: ColorItem[];
	onCrearColor: (nombre: string, hex: string) => Promise<number>;
	onAgregarVariacion: (payload: {
		celularId: number;
		colorId: number;
		precio: number;
		precioAnterior?: number | null;
		almacenamiento: string;
		stockInicial: number;
		imagenes: File[];
	}) => Promise<void>;
};

export const CelularDetalleExpandido = ({
	detalle,
	onGuardarDescripcion,
	onGuardarEspecificaciones,
	onGuardarVariacion,
	onAjustarStock,
	onSubirImagen,
	onEliminarImagen,
	onEliminarVariacion,
	colores,
	onCrearColor,
	onAgregarVariacion,
}: CelularDetalleExpandidoProps) => {
	const [creandoVariacion, setCreandoVariacion] = useState(false);
	const [guardandoVariacionNueva, setGuardandoVariacionNueva] = useState(false);
	const [nuevaVariacion, setNuevaVariacion] = useState({
		colorId: null as number | null,
		almacenamiento: "",
		precio: "",
		stockInicial: "",
		imagenes: [] as File[],
	});

	const crearVariacion = async () => {
		const colorId = Number(nuevaVariacion.colorId);
		const precio = Number(nuevaVariacion.precio);
		const stockInicial = Number(nuevaVariacion.stockInicial);
		if (!Number.isInteger(colorId) || colorId <= 0) return;
		if (!nuevaVariacion.almacenamiento.trim()) return;
		if (!Number.isFinite(precio) || precio <= 0) return;
		if (!Number.isInteger(stockInicial) || stockInicial < 0) return;
		try {
			setGuardandoVariacionNueva(true);
			await onAgregarVariacion({
				celularId: detalle.id,
				colorId,
				precio,
				precioAnterior: null,
				almacenamiento: nuevaVariacion.almacenamiento.trim(),
				stockInicial,
				imagenes: nuevaVariacion.imagenes,
			});
			setCreandoVariacion(false);
			setNuevaVariacion({
				colorId: null,
				almacenamiento: "",
				precio: "",
				stockInicial: "",
				imagenes: [],
			});
		} finally {
			setGuardandoVariacionNueva(false);
		}
	};

	return (
		<div className="space-y-4">
			<DescripcionEditor
				celularId={detalle.id}
				descripcion={detalle.descripcion}
				onGuardar={(descripcion) => onGuardarDescripcion(detalle, descripcion)}
			/>

			<EspecificacionesEditor
				celularId={detalle.id}
				especificaciones={detalle.especificaciones}
				onGuardar={(especificaciones) => onGuardarEspecificaciones(detalle, especificaciones)}
			/>

			<div>
				<div className="mb-2 flex items-center justify-between">
					<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">Variaciones</p>
					<button
						onClick={() => setCreandoVariacion((v) => !v)}
						className="h-8 rounded border border-[#cdd6e1] bg-white px-3 text-xs font-semibold text-[#334155] hover:bg-[#f8fafc]"
					>
						{creandoVariacion ? "Cancelar" : "Añadir variación"}
					</button>
				</div>
				{creandoVariacion && (
					<div className="mb-3 rounded-md border border-[#dbe4ef] bg-[#f8fafc] p-3">
						<div className="grid grid-cols-1 gap-2 md:grid-cols-4">
							<ColorSelector
								value={nuevaVariacion.colorId}
								colores={colores}
								onChange={(colorId) => setNuevaVariacion((p) => ({ ...p, colorId }))}
								onCrearColor={onCrearColor}
							/>
							<input placeholder="Almacenamiento" value={nuevaVariacion.almacenamiento} onChange={(e) => setNuevaVariacion((p) => ({ ...p, almacenamiento: e.target.value }))} className="h-9 rounded border border-[#cdd6e1] px-2 text-sm" />
							<input placeholder="Precio" type="number" value={nuevaVariacion.precio} onChange={(e) => setNuevaVariacion((p) => ({ ...p, precio: e.target.value }))} className="h-9 rounded border border-[#cdd6e1] px-2 text-sm" />
						</div>
						<div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
							<input placeholder="Stock inicial" type="number" value={nuevaVariacion.stockInicial} onChange={(e) => setNuevaVariacion((p) => ({ ...p, stockInicial: e.target.value }))} className="h-9 rounded border border-[#cdd6e1] px-2 text-sm" />
							<div>
								<input
									id={`add-var-imagenes-${detalle.id}`}
									type="file"
									accept="image/*"
									multiple
									onChange={(e) => {
										const nuevos = Array.from(e.target.files ?? []);
										if (nuevos.length === 0) return;
										setNuevaVariacion((p) => ({ ...p, imagenes: [...p.imagenes, ...nuevos] }));
									}}
									className="hidden"
								/>
								<label htmlFor={`add-var-imagenes-${detalle.id}`} className="inline-flex h-9 cursor-pointer items-center rounded border border-[#cdd6e1] bg-white px-3 text-xs font-semibold text-[#334155] hover:bg-[#f8fafc]">
									Seleccionar imágenes
								</label>
								{nuevaVariacion.imagenes.length > 0 && <p className="mt-1 text-xs text-[#475569]">{nuevaVariacion.imagenes.length} imagen(es). La primera será principal.</p>}
							</div>
						</div>
						<button
							onClick={() => void crearVariacion()}
							disabled={guardandoVariacionNueva}
							className="mt-2 h-8 rounded bg-[#015cb9] px-3 text-xs font-semibold text-white hover:bg-[#017AF4] disabled:opacity-60"
						>
							{guardandoVariacionNueva ? "Guardando..." : "Guardar variación"}
						</button>
					</div>
				)}
				<div className="mt-2 overflow-hidden rounded-md border border-[#dbe4ef] bg-white">
					<div className="grid grid-cols-[1fr_1fr_1fr_1fr] bg-[#eef3f8] px-3 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#475569]">
						<span>Color</span>
						<span>Almacenamiento</span>
						<span>Precio</span>
						<span>Stock / Acciones</span>
					</div>
					<div className="divide-y divide-black/10">
						{detalle.variaciones.map((v) => (
							<VariacionRowEditor
								key={v.id}
								variacion={v}
								onGuardarVariacion={onGuardarVariacion}
								onAjustarStock={onAjustarStock}
								onSubirImagen={onSubirImagen}
								onEliminarImagen={onEliminarImagen}
								onEliminarVariacion={onEliminarVariacion}
								colores={colores}
								onCrearColor={onCrearColor}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
