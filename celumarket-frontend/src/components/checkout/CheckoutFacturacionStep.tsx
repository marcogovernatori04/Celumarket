import { useState } from "react";
import type { ItemCarrito } from "../../services/carritoService";
import { CheckoutSidebarActions } from "./CheckoutSidebarActions";

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
	const puedeContinuar =
		Boolean(data.nombreCompleto.trim()) &&
		Boolean(data.dni.trim()) &&
		Boolean(data.email.trim()) &&
		Boolean(data.telefono.trim());

	const submit = () => {
		if (!data.nombreCompleto || !data.dni || !data.email || !data.telefono) return;
		onContinuar(data);
	};

	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
			<div className="space-y-4">
				<details className="rounded-xl border border-[#dfe5eb] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
					<summary className="cursor-pointer font-semibold text-[#001830]">Envío seleccionado</summary>
					<p className="mt-2 text-sm text-[#1e1e1e]">{resumenEnvio}</p>
				</details>
				<div className="rounded-xl border border-[#dfe5eb] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
					<h2 className="text-2xl font-bold text-[#001830]">2. Datos de facturación</h2>
					<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
						<input value={data.nombreCompleto} onChange={(e) => setData((s) => ({ ...s, nombreCompleto: e.target.value }))} className="h-11 rounded-lg border border-[#d5dde6] px-3 text-[15px] md:col-span-2" placeholder="Nombre y apellido" />
						<input value={data.dni} onChange={(e) => setData((s) => ({ ...s, dni: e.target.value }))} className="h-11 rounded-lg border border-[#d5dde6] px-3 text-[15px]" placeholder="DNI" />
						<input value={data.telefono} onChange={(e) => setData((s) => ({ ...s, telefono: e.target.value }))} className="h-11 rounded-lg border border-[#d5dde6] px-3 text-[15px]" placeholder="Teléfono" />
						<input value={data.email} onChange={(e) => setData((s) => ({ ...s, email: e.target.value }))} className="h-11 rounded-lg border border-[#d5dde6] px-3 text-[15px] md:col-span-2" placeholder="Email" />
					</div>
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
