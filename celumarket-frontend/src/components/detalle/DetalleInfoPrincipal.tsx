import type { CelularDetalle, VariacionDetalle } from "../../models/CelularDetalle";
import { DetalleSelectorVariaciones } from "./DetalleSelectorVariaciones";
import { twBase, twDetalleCelular } from "../../styles/tw";

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
	umbralEnvioGratis?: number;
	descuentoTransferencia?: number;
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
	umbralEnvioGratis = 499999,
	descuentoTransferencia = 10,
}: DetalleInfoPrincipalProps) => {
	return (
		<div>
			<h1 className={twDetalleCelular.detailTitle}>
				{detalle.marca} {detalle.modelo}
			</h1>
			<p className={twDetalleCelular.detailPrice}>
				${variacionActiva.precio.toLocaleString("es-AR")}
			</p>
			{variacionActiva.precio >= umbralEnvioGratis && (
				<span className={twDetalleCelular.detailShippingFree}>
					Envío gratis
				</span>
			)}
			{detalle.textoPromocion && (
				<p className={twDetalleCelular.detailPromoTag}>
					{detalle.textoPromocion}
				</p>
			)}
			<p className={twDetalleCelular.detailAuxText}>
				{descuentoTransferencia}% descuento efectivo/transferencia
			</p>
			<p className={twDetalleCelular.detailAuxTextTight}>
				Hasta 12 cuotas con tarjeta de crédito/débito
			</p>
			{mostrarInfoTecnica && (
				<>
					<p className={twDetalleCelular.detailDescription}>
						{detalle.descripcion}
					</p>
					<div className={twDetalleCelular.detailSpecs}>
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
				className={`${twBase.primaryBtnMd} mt-4 h-11 w-full text-sm`}
			>
				Agregar al carrito
			</button>
		</div>
	);
};
