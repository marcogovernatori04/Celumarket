import type { CelularDetalle, VariacionDetalle } from "../../models/CelularDetalle";
import { DetalleSelectorVariaciones } from "./DetalleSelectorVariaciones";

type DetalleInfoPrincipalProps = {
	detalle: CelularDetalle;
	variacionActiva: VariacionDetalle;
	almacenamientos: string[];
	almacenamientoSeleccionado: string;
	coloresUnicos: VariacionDetalle[];
	colorSeleccionadoId: number | null;
	onSelectAlmacenamiento: (almacenamiento: string) => void;
	onSelectColor: (colorId: number) => void;
	onAgregarAlCarrito: () => void;
	mostrarInfoTecnica?: boolean;
};

export const DetalleInfoPrincipal = ({
	detalle,
	variacionActiva,
	almacenamientos,
	almacenamientoSeleccionado,
	coloresUnicos,
	colorSeleccionadoId,
	onSelectAlmacenamiento,
	onSelectColor,
	onAgregarAlCarrito,
	mostrarInfoTecnica = true,
}: DetalleInfoPrincipalProps) => {
	return (
		<div>
			<h1 className="text-[30px] leading-tight font-semibold text-[#1e1e1e]">
				{detalle.marca} {detalle.modelo}
			</h1>
			<p className="mt-1.5 text-[42px] leading-none font-bold text-[#1e1e1e]">
				${variacionActiva.precio.toLocaleString("es-AR")}
			</p>
			{variacionActiva.precio >= 499999 && (
				<span className="mt-2.5 inline-flex w-fit rounded-full bg-[#E7F7EE] px-3 py-1.5 text-[14px] font-semibold text-[#1E8E5A]">
					Envío gratis
				</span>
			)}
			{detalle.textoPromocion && (
				<p className="mt-2.5 inline-flex rounded-full bg-[#dbe9ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#0b3f75]">
					{detalle.textoPromocion}
				</p>
			)}
			<p className="mt-2.5 text-[14px] text-[#4b6b91]">
				10% descuento efectivo/transferencia
			</p>
			<p className="mt-0.5 text-[14px] text-[#4b6b91]">
				Hasta 12 cuotas con tarjeta de crédito/débito
			</p>
			{mostrarInfoTecnica && (
				<>
					<p className="mt-2.5 text-[14px] leading-relaxed text-[#4b5563]">
						{detalle.descripcion}
					</p>
					<div className="mt-3 space-y-1 text-[14px] leading-snug text-[#666]">
						{detalle.especificaciones.map((esp, idx) => (
							<p key={idx}>
								• {esp.nombre}: {esp.valor}
							</p>
						))}
					</div>
				</>
			)}

			<DetalleSelectorVariaciones
				almacenamientos={almacenamientos}
				almacenamientoSeleccionado={almacenamientoSeleccionado}
				coloresUnicos={coloresUnicos}
				colorSeleccionadoId={colorSeleccionadoId}
				variacionActiva={variacionActiva}
				onSelectAlmacenamiento={onSelectAlmacenamiento}
				onSelectColor={onSelectColor}
			/>

			<button
				onClick={onAgregarAlCarrito}
				className="mt-4 h-11 w-full rounded-md bg-[#015cb9] text-sm font-medium text-white transition-colors duration-200 hover:bg-[#017AF4]"
			>
				Agregar al carrito
			</button>
		</div>
	);
};
