import { useEffect, useState } from "react";
import { pedidoService, type MetodoPago } from "../../services/pedidoService";
import type { DatosEnvio } from "./CheckoutEnvioStep";
import type { ItemCarrito } from "../../services/carritoService";
import type { DatosFacturacion } from "./CheckoutFacturacionStep";
import { CheckoutSidebarActions } from "./CheckoutSidebarActions";
import { isAxiosError } from "axios";
import { twBase, twCheckout } from "../../styles/tw";

type Props = {
	metodos: MetodoPago[];
	resumenEnvio: string;
	resumenFacturacion: string;
	segundosRestantes: number;
	datosEnvio: DatosEnvio;
	onVolver: () => void;
	onExito: (pedidoId: number) => void;
	onVolverCarrito: () => void;
	carritoItems: ItemCarrito[];
	subtotal: number;
	costoEnvio: number;
	datosFacturacion: DatosFacturacion;
};

export const CheckoutPagoStep = ({ metodos, resumenEnvio, resumenFacturacion, segundosRestantes, datosEnvio, onVolver, onExito, onVolverCarrito, carritoItems, subtotal, costoEnvio, datosFacturacion }: Props) => {
	const [metodoPagoId, setMetodoPagoId] = useState<number | null>(metodos[0]?.id ?? null);
	const [enviando, setEnviando] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);

	useEffect(() => {
		if (!mostrarModalConfirmacion) return;
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prevOverflow;
		};
	}, [mostrarModalConfirmacion]);

	const reservaExpirada = segundosRestantes <= 0;
	const metodoSeleccionado = metodos.find((m) => m.id === metodoPagoId);
	const total = subtotal + costoEnvio;
	const valorEnvioTexto = costoEnvio === 0 ? "Gratis" : `$${costoEnvio.toLocaleString("es-AR")}`;

	const confirmar = async (): Promise<boolean> => {
		if (!metodoPagoId || reservaExpirada) return false;
		setError(null);
		try {
			setEnviando(true);
			const result = await pedidoService.checkout({
				metodoPagoId,
				tipoEnvio: datosEnvio.tipoEnvio === "domicilio" ? 0 : datosEnvio.tipoEnvio === "sucursal-correo" ? 1 : 2,
				direccionEntrega: datosEnvio.tipoEnvio === "domicilio" ? datosEnvio.direccionEntrega : undefined,
			});
			sessionStorage.setItem("ultimoPedidoCheckoutId", String(result.pedidoId));
			if (result.linkMP) {
				window.location.href = result.linkMP;
				return true;
			}
			onExito(result.pedidoId);
			return true;
		} catch (err) {
			if (isAxiosError(err)) {
				const apiError = (err.response?.data as { error?: string; mensaje?: string; Message?: string; Details?: string } | undefined);
				const detalle = apiError?.Details ? ` (${apiError.Details})` : "";
				setError((apiError?.error ?? apiError?.mensaje ?? apiError?.Message ?? "No se pudo confirmar la compra.") + detalle);
			} else {
				setError("No se pudo confirmar la compra. Revisá que la reserva siga activa.");
			}
			return false;
		} finally {
			setEnviando(false);
		}
	};

	return (
		<div className={twCheckout.checkoutStepGrid}>
			<div className="space-y-4">
				<details className={twCheckout.checkoutCardCompact}>
					<summary className={twCheckout.checkoutSummaryTitle}>Envío seleccionado</summary>
					<p className={twCheckout.checkoutSummaryText}>{resumenEnvio}</p>
				</details>
				<details className={twCheckout.checkoutCardCompact}>
					<summary className={twCheckout.checkoutSummaryTitle}>Datos de facturación</summary>
					<p className={twCheckout.checkoutSummaryText}>{resumenFacturacion}</p>
				</details>
				<div className={`${twCheckout.checkoutCard} p-5`}>
					<h2 className="text-2xl font-bold text-[#001830]">3. Elegí cómo pagar</h2>
					<div className="mt-4 space-y-3">
						<button type="button" onClick={() => {
							const m = metodos.find((x) => x.nombre.toLowerCase().includes("transferencia"));
							if (m) setMetodoPagoId(m.id);
						}} className={`${twCheckout.checkoutMethodCard} ${metodos.find((x) => x.id === metodoPagoId)?.nombre.toLowerCase().includes("transferencia") ? twCheckout.checkoutMethodActive : twCheckout.checkoutMethodIdle}`}>
							<p className="font-semibold text-[#001830]">Transferencia bancaria</p>
						</button>
						<button type="button" onClick={() => {
							const m = metodos.find((x) => x.nombre.toLowerCase().includes("mercado pago"));
							if (m) setMetodoPagoId(m.id);
						}} className={`${twCheckout.checkoutMethodCard} ${metodos.find((x) => x.id === metodoPagoId)?.nombre.toLowerCase().includes("mercado pago") ? twCheckout.checkoutMethodActive : twCheckout.checkoutMethodIdle}`}>
							<p className="font-semibold text-[#001830]">Mercado Pago</p>
							<p className="text-sm text-[#4b5563]">Dinero en cuenta, tarjeta de crédito y débito.</p>
						</button>
					</div>
					{error && <p className="mt-3 text-red-600">{error}</p>}
				</div>
			</div>
			<CheckoutSidebarActions
				pasoLabel="Paso 3 de 3"
				descripcion="Elegí método de pago."
				items={carritoItems}
				subtotal={subtotal}
				costoEnvio={costoEnvio}
				total={subtotal + costoEnvio}
				primaryLabel={enviando ? "Confirmando..." : "Confirmar compra"}
				onPrimary={() => setMostrarModalConfirmacion(true)}
				primaryDisabled={reservaExpirada || enviando}
				secondaryLabel="Volver"
				onSecondary={onVolver}
				carritoLabel="← Volver al carrito"
				onVolverCarrito={onVolverCarrito}
			/>

			{mostrarModalConfirmacion && (
				<div className={twCheckout.checkoutModalOverlay}>
					<div className={twCheckout.checkoutModalCard}>
						<h3 className={twCheckout.checkoutModalTitle}>Confirmación final</h3>
						<div className="mt-5 space-y-4 text-[15px] text-[#1e1e1e]">
							<div>
								<p className={twCheckout.checkoutModalSectionTitle}>Detalle de la compra</p>
								<div className="mt-1.5 space-y-2">
									{carritoItems.map((item) => (
										<div key={item.variacionId} className={twCheckout.checkoutModalItemRow}>
											<p>
												{item.marca} {item.modelo} · {item.color} · x{item.cantidad}
											</p>
											<p className={twCheckout.checkoutModalItemAmount}>
												${(item.precioUnitario * item.cantidad).toLocaleString("es-AR")}
											</p>
										</div>
									))}
								</div>
							</div>
							<div>
								<p className={twCheckout.checkoutModalSectionTitle}>Envío</p>
								<p>{resumenEnvio}</p>
								{datosEnvio.tarifa && (
									<p className="mt-1 text-[#4b5563]">
										Demora estimada: {datosEnvio.tarifa.diasDemora} día{datosEnvio.tarifa.diasDemora > 1 ? "s" : ""} · Valor: <span className={costoEnvio === 0 ? "font-semibold text-[#1E8E5A]" : "font-semibold"}>{valorEnvioTexto}</span>
									</p>
								)}
							</div>
							<div>
								<p className={twCheckout.checkoutModalSectionTitle}>Facturación</p>
								<p>{datosFacturacion.nombreCompleto} · DNI {datosFacturacion.dni}</p>
								<p>{datosFacturacion.email} · {datosFacturacion.telefono}</p>
							</div>
							<div>
								<p className={twCheckout.checkoutModalSectionTitle}>Método de pago</p>
								<p>{metodoSeleccionado?.nombre ?? "Sin seleccionar"}</p>
								{metodoSeleccionado?.nombre?.toLowerCase().includes("mercado pago") && (
									<p className="mt-1 text-[#4b5563]">Serás redirigido a Mercado Pago para completar el pago.</p>
								)}
							</div>
							<div className="border-t border-[#e5e7eb] pt-3">
								<p className={twCheckout.checkoutModalTotal}>Total: ${total.toLocaleString("es-AR")}</p>
							</div>
						</div>
						{error && <p className="mt-3 text-sm text-red-600">{error}</p>}
						<div className="mt-6 flex justify-end gap-3">
							<button onClick={() => setMostrarModalConfirmacion(false)} className={twBase.secondaryBtnSm}>Volver</button>
							<button
								disabled={reservaExpirada || enviando || !metodoPagoId}
								onClick={async () => {
									const ok = await confirmar();
									if (ok) setMostrarModalConfirmacion(false);
								}}
								className={`${twCheckout.checkoutPrimaryBtnSm} ${!reservaExpirada && !enviando && metodoPagoId ? "bg-[#015cb9] hover:bg-[#017AF4]" : "bg-[#757575] text-[#d9d9d9]"}`}
							>
								{enviando ? "Confirmando..." : "Confirmar"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
