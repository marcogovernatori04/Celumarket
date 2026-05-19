import { useState } from "react";
import type { VariacionDetalle } from "../../../models/CelularDetalle";
import type { ColorItem } from "../../../services/colorService";
import { ColorSelector } from "./ColorSelector";
import { twBase } from "../../../styles/tw";

type VariacionRowEditorProps = {
	variacion: VariacionDetalle;
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
};

export const VariacionRowEditor = ({ variacion, onGuardarVariacion, onAjustarStock, onSubirImagen, onEliminarImagen, onEliminarVariacion, colores, onCrearColor }: VariacionRowEditorProps) => {
	const [editando, setEditando] = useState(false);
	const [guardando, setGuardando] = useState(false);
	const [ajustando, setAjustando] = useState(false);
	const [colorId, setColorId] = useState(variacion.colorId);
	const [almacenamiento, setAlmacenamiento] = useState(variacion.almacenamiento);
	const [precio, setPrecio] = useState(variacion.precio.toString());
	const [stockDelta, setStockDelta] = useState("");
	const [archivo, setArchivo] = useState<File | null>(null);
	const [gestionandoImagen, setGestionandoImagen] = useState(false);
	const inputFileId = `imagen-variacion-${variacion.id}`;

	const guardar = async () => {
		const precioNum = Number(precio);
		const colorIdNum = Number(colorId);
		if (!Number.isFinite(precioNum) || precioNum <= 0) return;
		if (!Number.isInteger(colorIdNum) || colorIdNum <= 0) return;
		try {
			setGuardando(true);
			await onGuardarVariacion({
				variacionId: variacion.id,
				colorId: colorIdNum,
				precio: precioNum,
				precioAnterior: null,
				almacenamiento,
			});
			setEditando(false);
		} finally {
			setGuardando(false);
		}
	};

	const ajustarStock = async (tipo: "ingreso" | "perdida") => {
		const cantidad = Number(stockDelta);
		if (!Number.isInteger(cantidad) || cantidad <= 0) return;
		try {
			setAjustando(true);
			await onAjustarStock(variacion.id, cantidad, tipo);
			setStockDelta("");
		} finally {
			setAjustando(false);
		}
	};

	return (
		<div className="px-3 py-2 text-sm text-[#334155]">
			<div className="grid grid-cols-[1fr_1fr_1fr_1fr] items-start gap-2">
				<span>
					{editando ? (
						<ColorSelector
							value={colorId}
							colores={colores}
							onChange={setColorId}
							onCrearColor={onCrearColor}
						/>
					) : (
						`${variacion.color} (ID ${variacion.colorId})`
					)}
				</span>
				<span>
					{editando ? (
						<input
							value={almacenamiento}
							onChange={(e) => setAlmacenamiento(e.target.value)}
							className="h-8 w-full rounded border border-[#cdd6e1] px-2 text-xs"
						/>
					) : (
						variacion.almacenamiento
					)}
				</span>
				<span>
					{editando ? (
						<input
							type="number"
							min={1}
							step="0.01"
							value={precio}
							onChange={(e) => setPrecio(e.target.value)}
							className="h-8 w-full rounded border border-[#cdd6e1] px-2 text-xs"
						/>
					) : (
						<div>
							<div>${variacion.precio.toLocaleString("es-AR")}</div>
							{variacion.precioAnterior && <div className="text-xs text-[#64748b] line-through">${variacion.precioAnterior.toLocaleString("es-AR")}</div>}
						</div>
					)}
				</span>
				<div>
					<div className="font-semibold">{variacion.stock}</div>
					<div className="mt-1 flex items-center gap-1">
						<input
							type="number"
							min={1}
							placeholder="cant."
							value={stockDelta}
							onChange={(e) => setStockDelta(e.target.value)}
							className="h-8 w-[74px] rounded border border-[#cdd6e1] px-2 text-xs"
						/>
						<button
							onClick={() => void ajustarStock("ingreso")}
							disabled={ajustando}
							className="h-8 rounded bg-[#e8f5e9] px-2 text-xs font-semibold text-[#1b5e20] hover:bg-[#d9efdc] disabled:opacity-60"
						>
							+Stock
						</button>
						<button
							onClick={() => void ajustarStock("perdida")}
							disabled={ajustando}
							className="h-8 rounded bg-[#ffebee] px-2 text-xs font-semibold text-[#b71c1c] hover:bg-[#fbd8dd] disabled:opacity-60"
						>
							-Stock
						</button>
					</div>
					<div className="mt-2 flex gap-1">
						{editando ? (
							<>
								<button
									onClick={() => void guardar()}
									disabled={guardando}
									className={twBase.actionBtnPrimary}
								>
									Guardar
								</button>
								<button
									onClick={() => setEditando(false)}
									className={twBase.actionBtnNeutral}
								>
									Cancelar
								</button>
							</>
						) : (
							<div className="flex gap-1">
								<button
									onClick={() => setEditando(true)}
									className={twBase.actionBtnNeutral}
								>
									Editar variación
								</button>
								<button
									onClick={() => void onEliminarVariacion(variacion.id)}
									className={twBase.actionBtnDanger}
								>
									Eliminar
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="mt-3 rounded-md border border-[#dbe4ef] bg-[#f8fafc] p-3">
				<p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#64748b]">Imágenes de la variación</p>
				<div className="flex flex-wrap gap-2">
					{variacion.imagenes.map((img) => (
						<div key={img} className="relative h-24 w-24 overflow-hidden rounded border border-[#dbe4ef] bg-white">
							<img src={img} alt="Imagen variación" className="h-full w-full object-contain" />
							<button
								onClick={async () => {
									try {
										setGestionandoImagen(true);
										await onEliminarImagen(variacion.id, img);
									} finally {
										setGestionandoImagen(false);
									}
								}}
								disabled={gestionandoImagen}
								className="absolute right-0 top-0 rounded-bl bg-[#b42318] px-1 text-[10px] text-white disabled:opacity-60"
							>
								x
							</button>
						</div>
					))}
				</div>
				<div className="mt-2 flex flex-wrap items-center gap-2">
					<input
						id={inputFileId}
						type="file"
						accept="image/*"
						onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
						className="hidden"
					/>
					<label
						htmlFor={inputFileId}
						className={`${twBase.actionBtnNeutral} cursor-pointer inline-flex items-center`}
					>
						Seleccionar imagen
					</label>
					{archivo && (
						<span className="max-w-[180px] truncate text-xs text-[#475569]">
							{archivo.name}
						</span>
					)}
					<button
						onClick={async () => {
							if (!archivo) return;
							try {
								setGestionandoImagen(true);
								await onSubirImagen(variacion.id, archivo);
								setArchivo(null);
							} finally {
								setGestionandoImagen(false);
							}
						}}
						disabled={!archivo || gestionandoImagen}
						className={twBase.actionBtnNeutral}
					>
						Añadir imagen
					</button>
				</div>
			</div>
		</div>
	);
};
