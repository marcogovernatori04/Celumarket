import type { VariacionDetalle } from "../../models/CelularDetalle";
import { twDetalleCelular } from "../../styles/tw";

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
			<p className={twDetalleCelular.variationLabel}>Almacenamiento</p>
			<div className="mb-4 flex flex-wrap gap-2.5">
				{almacenamientos.map((alm) => {
					const activo = almacenamientoSeleccionado === alm;
					return (
						<button
							key={alm}
							type="button"
							onClick={() => onSelectAlmacenamiento(alm)}
							className={`${twDetalleCelular.variationStorageBtn} ${activo ? twDetalleCelular.variationStorageActive : twDetalleCelular.variationStorageIdle}`}
						>
							{alm}
						</button>
					);
				})}
			</div>

			<p className={twDetalleCelular.variationLabel}>Colores</p>
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
							className={`${twDetalleCelular.variationColorBtn} ${activo ? twDetalleCelular.variationColorActive : esBlanco ? twDetalleCelular.variationColorWhite : twDetalleCelular.variationColorDefault}`}
							style={{ backgroundColor: variacion.colorHex ?? "#6b7280" }}
						/>
					);
				})}
			</div>
			<p className="mt-2 text-xs text-[#6b7280]">{variacionActiva.color}</p>
		</div>
	);
};
