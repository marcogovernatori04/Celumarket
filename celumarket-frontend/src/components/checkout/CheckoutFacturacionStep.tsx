import { useState } from "react";
import type { ItemCarrito } from "../../services/carritoService";
import { CheckoutSidebarActions } from "./CheckoutSidebarActions";
import { twCheckout } from "../../styles/tw";
import { esDniValido, esEmailValido, esNombreCompletoValido, esTelefonoValido } from "../../utils/validation";

export type DatosFacturacion = {
	nombreCompleto: string;
	dni: string;
	email: string;
	telefono: string;
};

type Props = {
	initialData: DatosFacturacion;
	resumenEnvio: string;
	onVolver: () => void;
	onContinuar: (data: DatosFacturacion) => void;
	onVolverCarrito: () => void;
	carritoItems: ItemCarrito[];
	subtotal: number;
	costoEnvio: number;
};

export const CheckoutFacturacionStep = ({ initialData, resumenEnvio, onVolver, onContinuar, onVolverCarrito, carritoItems, subtotal, costoEnvio }: Props) => {
	const [data, setData] = useState<DatosFacturacion>(initialData);
	const [error, setError] = useState<string | null>(null);
	const puedeContinuar =
		Boolean(data.nombreCompleto.trim()) &&
		Boolean(data.dni.trim()) &&
		Boolean(data.email.trim()) &&
		Boolean(data.telefono.trim());

	const validar = () => {
		if (!data.nombreCompleto.trim() || !data.dni.trim() || !data.email.trim() || !data.telefono.trim()) {
			return "Completá todos los campos de facturación.";
		}
		if (!esNombreCompletoValido(data.nombreCompleto)) {
			return "Ingresá nombre y apellido sin números.";
		}
		if (!esDniValido(data.dni)) {
			return "El DNI debe contener 7 u 8 números.";
		}
		if (!esTelefonoValido(data.telefono)) {
			return "El teléfono debe ser válido y no debe contener letras.";
		}
		if (!esEmailValido(data.email)) {
			return "Ingresá un email válido.";
		}
		return null;
	};

	const submit = () => {
		const errorValidacion = validar();
		if (errorValidacion) {
			setError(errorValidacion);
			return;
		}
		setError(null);
		onContinuar({
			nombreCompleto: data.nombreCompleto.trim(),
			dni: data.dni.trim(),
			email: data.email.trim(),
			telefono: data.telefono.trim(),
		});
	};

	const actualizarCampo = (campo: keyof DatosFacturacion, value: string) => {
		setData((s) => ({ ...s, [campo]: value }));
		if (error) setError(null);
	};

	return (
		<div className={twCheckout.checkoutStepGrid}>
			<div className="space-y-4">
				<details className={twCheckout.checkoutCardCompact}>
					<summary className={twCheckout.checkoutSummaryTitle}>Envío seleccionado</summary>
					<p className={twCheckout.checkoutSummaryText}>{resumenEnvio}</p>
				</details>
				<div className={`${twCheckout.checkoutCard} p-4 sm:p-5`}>
					<h2 className="text-xl font-bold text-[#001830] sm:text-2xl">2. Datos de facturación</h2>
					<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
						<input value={data.nombreCompleto} onChange={(e) => actualizarCampo("nombreCompleto", e.target.value)} className={`${twCheckout.checkoutInput} sm:col-span-2`} placeholder="Nombre y apellido" autoComplete="name" />
						<input value={data.dni} onChange={(e) => actualizarCampo("dni", e.target.value)} className={twCheckout.checkoutInput} placeholder="DNI" inputMode="numeric" />
						<input value={data.telefono} onChange={(e) => actualizarCampo("telefono", e.target.value)} className={twCheckout.checkoutInput} placeholder="Teléfono" inputMode="tel" autoComplete="tel" />
						<input value={data.email} onChange={(e) => actualizarCampo("email", e.target.value)} className={`${twCheckout.checkoutInput} sm:col-span-2`} placeholder="Email" type="email" autoComplete="email" />
					</div>
					{error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
				</div>
			</div>
			<CheckoutSidebarActions
				pasoLabel="Paso 2 de 3"
				descripcion="Revisá y confirmá facturación."
				items={carritoItems}
				subtotal={subtotal}
				costoEnvio={costoEnvio}
				total={subtotal + costoEnvio}
				primaryLabel="Continuar"
				onPrimary={submit}
				primaryDisabled={!puedeContinuar}
				secondaryLabel="Volver"
				onSecondary={onVolver}
				carritoLabel="← Volver al carrito"
				onVolverCarrito={onVolverCarrito}
			/>
		</div>
	);
};
