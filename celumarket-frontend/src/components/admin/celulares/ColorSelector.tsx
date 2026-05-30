import { useState } from "react";
import type { ColorItem } from "../../../services/colorService";
import { twBase } from "../../../styles/tw";

type ColorSelectorProps = {
	value: number | null;
	colores: ColorItem[];
	onChange: (colorId: number) => void;
	onCrearColor: (nombre: string, hex: string) => Promise<number>;
};

export const ColorSelector = ({ value, colores, onChange, onCrearColor }: ColorSelectorProps) => {
	const [creando, setCreando] = useState(false);
	const [nombreNuevo, setNombreNuevo] = useState("");
	const [hexNuevo, setHexNuevo] = useState("#8AB9F1");
	const [guardando, setGuardando] = useState(false);
	const colorActual = colores.find((c) => c.id === value) ?? null;

	const crear = async () => {
		if (!nombreNuevo.trim()) return;
		try {
			setGuardando(true);
			const nuevoId = await onCrearColor(nombreNuevo.trim(), hexNuevo);
			onChange(nuevoId);
			setCreando(false);
			setNombreNuevo("");
			setHexNuevo("#8AB9F1");
		} finally {
			setGuardando(false);
		}
	};

	return (
		<div className="min-w-0">
			<div className="flex flex-wrap items-center gap-2">
				<div className="inline-flex min-w-0 items-center gap-2 rounded-md border border-[#cdd6e1] bg-white px-2 py-1.5">
					<span className="h-4 w-4 rounded-full border border-black/20" style={{ backgroundColor: colorActual?.hex ?? "#d1d5db" }} />
					<select
						value={value ?? ""}
						onChange={(e) => onChange(Number(e.target.value))}
						className="min-w-[150px] max-w-full bg-transparent text-sm text-[#334155] outline-none"
					>
						<option value="" disabled>Seleccionar color</option>
						{colores.map((c) => (
							<option key={c.id} value={c.id}>
								{c.nombre}
							</option>
						))}
					</select>
				</div>
				<button
					onClick={() => setCreando((v) => !v)}
					className={creando ? twBase.actionBtnCancel : twBase.actionBtnNeutral}
				>
					{creando ? "Cancelar" : "Nuevo color"}
				</button>
			</div>

			{creando && (
				<div className="mt-2 flex flex-wrap items-center gap-2 rounded-md border border-[#dbe4ef] bg-[#f8fafc] p-2">
					<input
						value={nombreNuevo}
						onChange={(e) => setNombreNuevo(e.target.value)}
						placeholder="Nombre color"
						className="h-8 rounded border border-[#cdd6e1] bg-white px-2 text-xs"
					/>
					<input
						type="color"
						value={hexNuevo}
						onChange={(e) => setHexNuevo(e.target.value)}
						className="h-8 w-10 cursor-pointer rounded border border-[#cdd6e1] bg-white p-1"
					/>
					<span className="text-xs text-[#475569]">{hexNuevo.toUpperCase()}</span>
					<button
						onClick={() => void crear()}
						disabled={guardando}
						className={twBase.actionBtnPrimary}
					>
						{guardando ? "Creando..." : "Crear y usar"}
					</button>
				</div>
			)}
		</div>
	);
};
