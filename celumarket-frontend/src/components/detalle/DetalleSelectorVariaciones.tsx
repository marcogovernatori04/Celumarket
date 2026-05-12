import type { VariacionDetalle } from "../../models/CelularDetalle";

type DetalleSelectorVariacionesProps = {
	almacenamientos: string[];
	almacenamientoSeleccionado: string;
	coloresUnicos: VariacionDetalle[];
	colorSeleccionadoId: number | null;
	variacionActiva: VariacionDetalle;
	onSelectAlmacenamiento: (almacenamiento: string) => void;
	onSelectColor: (colorId: number) => void;
};

export const DetalleSelectorVariaciones = ({
	almacenamientos,
	almacenamientoSeleccionado,
	coloresUnicos,
	colorSeleccionadoId,
	variacionActiva,
	onSelectAlmacenamiento,
	onSelectColor,
}: DetalleSelectorVariacionesProps) => {
	return (
		<div className="mt-5">
			<p className="mb-2 text-sm font-medium text-[#1e1e1e]">Almacenamiento</p>
			<div className="mb-4 flex flex-wrap gap-2.5">
				{almacenamientos.map((alm) => {
					const activo = almacenamientoSeleccionado === alm;
					return (
						<button
							key={alm}
							type="button"
							onClick={() => onSelectAlmacenamiento(alm)}
							className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${activo ? "bg-[#015cb9] text-white" : "bg-[#eef2f7] text-[#4b5563] hover:bg-[#dbe5f1]"}`}
						>
							{alm}
						</button>
					);
				})}
			</div>

			<p className="mb-2 text-sm font-medium text-[#1e1e1e]">Colores</p>
			<div className="flex flex-wrap items-center gap-2">
				{coloresUnicos.map((variacion) => {
					const activo = colorSeleccionadoId === variacion.colorId;
					const esBlanco =
						(variacion.colorHex ?? "").toLowerCase() === "#f5f5f5" ||
						(variacion.colorHex ?? "").toLowerCase() === "#ffffff";
					return (
						<button
							key={variacion.colorId}
							type="button"
							onClick={() => onSelectColor(variacion.colorId)}
							title={variacion.color}
							aria-label={`Color ${variacion.color}`}
							className={`h-9 w-9 rounded-full border-2 transition-all duration-200 ${activo ? "border-[#015cb9] scale-110 shadow-md" : esBlanco ? "border-[#cfd4dc] hover:scale-105 hover:shadow" : "border-white hover:scale-105 hover:shadow"}`}
							style={{ backgroundColor: variacion.colorHex ?? "#6b7280" }}
						/>
					);
				})}
			</div>
			<p className="mt-2 text-xs text-[#6b7280]">{variacionActiva.color}</p>
		</div>
	);
};
