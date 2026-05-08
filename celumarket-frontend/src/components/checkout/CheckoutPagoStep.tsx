import { useMemo, useState } from "react";
import { pedidoService, type MetodoPago } from "../../services/pedidoService";
import type { DatosEnvio } from "./CheckoutEnvioStep";

type Props = {
	metodos: MetodoPago[];
	resumenEnvio: string;
	resumenFacturacion: string;
	segundosRestantes: number;
	datosEnvio: DatosEnvio;
	onVolver: () => void;
	onExito: (pedidoId: number) => void;
};

export const CheckoutPagoStep = ({ metodos, resumenEnvio, resumenFacturacion, segundosRestantes, datosEnvio, onVolver, onExito }: Props) => {
	const [metodoPagoId, setMetodoPagoId] = useState<number | null>(metodos[0]?.id ?? null);
	const [enviando, setEnviando] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const reservaExpirada = segundosRestantes <= 0;
	const tiempo = useMemo(() => {
		const mm = Math.floor(segundosRestantes / 60).toString().padStart(2, "0");
		const ss = (segundosRestantes % 60).toString().padStart(2, "0");
		return `${mm}:${ss}`;
	}, [segundosRestantes]);

	const confirmar = async () => {
		if (!metodoPagoId || reservaExpirada) return;
		setError(null);
		try {
			setEnviando(true);
			const result = await pedidoService.checkout({
				metodoPagoId,
				tipoEnvio: datosEnvio.tipoEnvio === "domicilio" ? 0 : datosEnvio.tipoEnvio === "sucursal-correo" ? 1 : 2,
				direccionEntrega: datosEnvio.tipoEnvio === "domicilio" ? datosEnvio.direccionEntrega : undefined,
			});
			if (result.linkMP) {
				window.location.href = result.linkMP;
				return;
			}
			onExito(result.pedidoId);
		} catch {
			setError("No se pudo confirmar la compra. Revisá que la reserva siga activa.");
		} finally {
			setEnviando(false);
		}
	};

	return (
		<div className="space-y-6">
			<details className="rounded-xl border border-[#dfe5eb] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
				<summary className="cursor-pointer font-semibold text-[#001830]">Envío seleccionado</summary>
				<p className="mt-2 text-sm text-[#1e1e1e]">{resumenEnvio}</p>
			</details>
			<details className="rounded-xl border border-[#dfe5eb] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
				<summary className="cursor-pointer font-semibold text-[#001830]">Datos de facturación</summary>
				<p className="mt-2 text-sm text-[#1e1e1e]">{resumenFacturacion}</p>
			</details>
			<div className="rounded-xl border border-[#dfe5eb] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
				<h2 className="text-2xl font-bold text-[#001830]">3. Elegí cómo pagar</h2>
				<p className="mt-1 text-sm text-[#1e1e1e]">Reserva activa: <span className={reservaExpirada ? "text-red-600 font-semibold" : "font-semibold"}>{tiempo}</span></p>
				<div className="mt-4 space-y-3">
					<button type="button" onClick={() => {
						const m = metodos.find((x) => x.nombre.toLowerCase().includes("transferencia"));
						if (m) setMetodoPagoId(m.id);
					}} className={`w-full rounded-xl border p-4 text-left transition-colors ${metodos.find((x) => x.id === metodoPagoId)?.nombre.toLowerCase().includes("transferencia") ? "border-[#015cb9] bg-[#eef4fb]" : "border-[#d9d9d9] bg-white hover:bg-[#f7fbff]"}`}>
						<p className="font-semibold text-[#001830]">Transferencia bancaria</p>
					</button>
					<button type="button" onClick={() => {
						const m = metodos.find((x) => x.nombre.toLowerCase().includes("mercado pago"));
						if (m) setMetodoPagoId(m.id);
					}} className={`w-full rounded-xl border p-4 text-left transition-colors ${metodos.find((x) => x.id === metodoPagoId)?.nombre.toLowerCase().includes("mercado pago") ? "border-[#015cb9] bg-[#eef4fb]" : "border-[#d9d9d9] bg-white hover:bg-[#f7fbff]"}`}>
						<p className="font-semibold text-[#001830]">Mercado Pago</p>
						<p className="text-sm text-[#4b5563]">Dinero en cuenta, tarjeta de crédito y débito.</p>
					</button>
				</div>
				{error && <p className="mt-3 text-red-600">{error}</p>}
			</div>
			<div className="flex gap-3">
				<button onClick={onVolver} className="h-[44px] rounded-lg border border-[#001830] px-6 text-[#001830] hover:bg-[#eef4fb] transition-colors">Volver</button>
				<button disabled={reservaExpirada || enviando} onClick={confirmar} className={`h-[44px] rounded-lg px-6 text-white transition-colors ${!reservaExpirada && !enviando ? "bg-[#015cb9] hover:bg-[#017AF4]" : "bg-[#757575] text-[#d9d9d9]"}`}>{enviando ? "Confirmando..." : "Confirmar compra"}</button>
			</div>
		</div>
	);
};
