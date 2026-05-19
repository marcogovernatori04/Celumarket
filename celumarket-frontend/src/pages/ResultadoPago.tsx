import type { ReactNode } from "react";
import { Footer } from "../components/Footer";
import type { DetallePedido } from "../services/pedidoService";
import { getMetodoPagoLabel, getTipoPagoLabel } from "../utils/mercadoPagoDisplay";
import { twBase, twResultadoPago } from "../styles/tw";

type EstadoPago = "exitoso" | "fallido" | "pendiente";

type ResultadoPagoProps = {
	estado: EstadoPago;
	onIrATienda: () => void;
	onVerMisPedidos: () => void;
	detallePedido?: DetallePedido | null;
};

const contenidoPorEstado: Record<EstadoPago, { etiqueta: string; titulo: string; descripcion: string; color: string; fondo: string; icono: ReactNode }> = {
	exitoso: {
		etiqueta: "Confirmación de compra",
		titulo: "Pago exitoso",
		descripcion: "Tu pago con Mercado Pago fue aprobado correctamente.",
		color: "#1E8E5A",
		fondo: "#eaf8f1",
		icono: (
			<path d="M20 6 9 17l-5-5"></path>
		),
	},
	pendiente: {
		etiqueta: "Estado del pago",
		titulo: "Pago pendiente",
		descripcion: "Tu pago quedó pendiente de confirmación. Te avisaremos cuando se acredite.",
		color: "#B26A00",
		fondo: "#fff7e8",
		icono: (
			<>
				<circle cx="12" cy="12" r="9"></circle>
				<path d="M12 7v6"></path>
				<path d="m12 16 .01 0"></path>
			</>
		),
	},
	fallido: {
		etiqueta: "Estado del pago",
		titulo: "Pago rechazado",
		descripcion: "No pudimos procesar el pago. Podés intentarlo nuevamente con otro medio de pago.",
		color: "#B42318",
		fondo: "#fff0ef",
		icono: (
			<>
				<circle cx="12" cy="12" r="9"></circle>
				<path d="m15 9-6 6"></path>
				<path d="m9 9 6 6"></path>
			</>
		),
	},
};

export const ResultadoPago = ({ estado, onIrATienda, onVerMisPedidos, detallePedido }: ResultadoPagoProps) => {
	const contenido = contenidoPorEstado[estado];
	const pagosMpRaw = detallePedido?.pagosMercadoPago && detallePedido.pagosMercadoPago.length > 0
		? detallePedido.pagosMercadoPago
		: (detallePedido?.datosPagoMercadoPago ? [detallePedido.datosPagoMercadoPago] : []);
	const pagosMp = pagosMpRaw.filter((pago, idx, arr) => {
		const id = pago.paymentIdExterno?.trim();
		if (!id) return true;
		return arr.findIndex((p) => p.paymentIdExterno?.trim() === id) === idx;
	});

	return (
		<div className={twResultadoPago.layout}>
			<section className={twResultadoPago.section}>
				<div className={twResultadoPago.card}>
					<p className="text-center text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">{contenido.etiqueta}</p>
					<div className="mx-auto mt-4 flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: contenido.fondo }}>
						<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={contenido.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							{contenido.icono}
						</svg>
					</div>
					<h1 className="mt-4 text-center text-[34px] font-extrabold leading-none text-[#001830]">{contenido.titulo}</h1>
					<p className="mx-auto mt-2 max-w-2xl text-center text-[16px] text-[#4b5563]">{contenido.descripcion}</p>
					{estado === "exitoso" && pagosMp.length > 0 && (
						<div className={twResultadoPago.detailBox}>
							<p className="text-[15px] font-semibold text-[#001830]">Detalle del pago</p>
							<div className="mt-2 space-y-3">
								{pagosMp.map((pago, idx) => (
									<div key={`${pago.paymentIdExterno ?? "pago"}-${idx}`} className={twResultadoPago.detailItem}>
										<p className="text-sm font-semibold text-[#001830]">Medio #{idx + 1}</p>
										<div className={twResultadoPago.detailGrid}>
											<p>Método: {getMetodoPagoLabel(pago.metodoPagoId)}</p>
											<p>Tipo: {getTipoPagoLabel(pago.tipoPagoId)}</p>
											<p>Cuotas: {pago.cuotas > 0 ? pago.cuotas : 1}</p>
											<p>Monto pagado: ${(pago.montoPagado ?? pago.montoTotalFinal ?? 0).toLocaleString("es-AR")}</p>
											{pago.valorCuota ? <p>Valor cuota: ${pago.valorCuota.toLocaleString("es-AR")}</p> : null}
											{pago.paymentIdExterno ? <p>Id pago MP: {pago.paymentIdExterno}</p> : null}
										</div>
									</div>
								))}
								<p className="text-sm font-semibold text-[#001830]">
									Total abonado: ${pagosMp.reduce((acc, p) => acc + (p.montoPagado ?? p.montoTotalFinal ?? 0), 0).toLocaleString("es-AR")}
								</p>
							</div>
						</div>
					)}
					<div className={twResultadoPago.info}>
						Podés revisar el detalle y estado actualizado de tu pedido en Mis pedidos.
					</div>
					<div className={twResultadoPago.actions}>
						<button onClick={onVerMisPedidos} className={twBase.primaryBtn}>
							Ver mis pedidos
						</button>
						<button onClick={onIrATienda} className={twBase.secondaryBtn}>
							Volver a la tienda
						</button>
					</div>
				</div>
			</section>
			<div className="mt-auto">
				<Footer />
			</div>
		</div>
	);
};
