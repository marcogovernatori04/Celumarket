import type { CelularDetalle } from "../../../models/CelularDetalle";
import { DescripcionEditor } from "./DescripcionEditor";
import { EspecificacionesEditor } from "./EspecificacionesEditor";
import { VariacionRowEditor } from "./VariacionRowEditor";

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
};

export const CelularDetalleExpandido = ({
	detalle,
	onGuardarDescripcion,
	onGuardarEspecificaciones,
	onGuardarVariacion,
	onAjustarStock,
	onSubirImagen,
	onEliminarImagen,
}: CelularDetalleExpandidoProps) => {
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
				<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">Variaciones</p>
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
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
