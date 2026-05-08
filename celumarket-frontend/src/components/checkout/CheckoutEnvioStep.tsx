import { useState } from "react";
import { tarifaService, type TarifaPorCodigoPostal } from "../../services/tarifaService";

export type DatosEnvio = {
	tipoEnvio: "domicilio" | "sucursal-correo" | "retiro-local";
	tarifa: TarifaPorCodigoPostal | null;
	direccionEntrega?: {
		calle: string;
		numero: string;
		pisoDepto?: string;
		localidad: string;
		provincia: string;
		codigoPostal: number;
	};
};

type Props = {
	direccionInicial?: {
		calle: string;
		numero: string;
		pisoDepto?: string;
		localidad: string;
		provincia: string;
		codigoPostal: number;
	};
	onContinuar: (datos: DatosEnvio) => void;
};

export const CheckoutEnvioStep = ({ direccionInicial, onContinuar }: Props) => {
	const [codigoPostal, setCodigoPostal] = useState(direccionInicial?.codigoPostal?.toString() ?? "");
	const [tarifa, setTarifa] = useState<TarifaPorCodigoPostal | null>(null);
	const [errorTarifa, setErrorTarifa] = useState<string | null>(null);
	const [tipoEnvio, setTipoEnvio] = useState<"domicilio" | "sucursal-correo" | "retiro-local" | null>(null);
	const [direccion, setDireccion] = useState({
		calle: direccionInicial?.calle ?? "",
		numero: direccionInicial?.numero ?? "",
		pisoDepto: direccionInicial?.pisoDepto ?? "",
		localidad: direccionInicial?.localidad ?? "",
		provincia: direccionInicial?.provincia ?? "",
		codigoPostal: direccionInicial?.codigoPostal?.toString() ?? "",
	});

	const buscarTarifa = async () => {
		setErrorTarifa(null);
		setTarifa(null);

		const cp = Number(codigoPostal);
		if (!Number.isInteger(cp) || cp <= 0) {
			setErrorTarifa("Ingresá un código postal válido.");
			return;
		}

		try {
			const data = await tarifaService.obtenerPorCodigoPostal(cp);
			setTarifa(data);
			if (!direccion.codigoPostal) {
				setDireccion((s) => ({ ...s, codigoPostal: String(cp) }));
			}
		} catch {
			setErrorTarifa("No encontramos tarifas para ese código postal.");
		}
	};

	const continuar = () => {
		if (!tipoEnvio) return;
		if (tipoEnvio !== "retiro-local" && !tarifa) return;

		if (tipoEnvio === "domicilio") {
			if (!direccion.calle || !direccion.numero || !direccion.localidad || !direccion.provincia || !direccion.codigoPostal) {
				setErrorTarifa("Completá la dirección de entrega para envío a domicilio.");
				return;
			}

			onContinuar({
				tipoEnvio,
				tarifa,
				direccionEntrega: {
					calle: direccion.calle,
					numero: direccion.numero,
					pisoDepto: direccion.pisoDepto || undefined,
					localidad: direccion.localidad,
					provincia: direccion.provincia,
					codigoPostal: Number(direccion.codigoPostal),
				},
			});
			return;
		}

		onContinuar({ tipoEnvio, tarifa });
	};

	return (
		<div className="space-y-6">
			<div className="rounded-xl border border-[#dfe5eb] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
				<h2 className="text-2xl font-bold text-[#001830]">1. Elegí tu envío</h2>
				<p className="mt-3 text-[#1e1e1e]">Ingresá tu código postal:</p>
				<div className="mt-3 flex items-center gap-2">
					<input value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} className="h-11 flex-1 rounded-full border border-[#d5dde6] bg-white px-4 text-[15px]" />
					<button onClick={buscarTarifa} className="h-11 rounded-lg bg-[#015cb9] px-5 text-sm text-white hover:bg-[#017AF4] transition-colors">Buscar</button>
				</div>
				{errorTarifa && <p className="mt-2 text-sm text-red-600">{errorTarifa}</p>}

				{tarifa && (
					<div className="mt-4 space-y-4">
						<div onClick={() => setTipoEnvio("domicilio")} className={`cursor-pointer rounded-xl border-2 bg-white p-4 ${tipoEnvio === "domicilio" ? "border-[#015cb9]" : "border-[#e6ecf2]"} shadow-[0_1px_2px_rgba(0,0,0,0.06)]`}>
							<p className="text-[19px] font-semibold text-[#1e1e1e]">Envío a domicilio</p>
							<p className="text-sm text-[#4b5563]">Llega en aprox. {tarifa.diasDemora} día{tarifa.diasDemora > 1 ? "s" : ""}.</p>
							<p className="mt-1 font-semibold text-[#001830]">${tarifa.precioDomicilio.toLocaleString("es-AR")}</p>
						</div>

						<div onClick={() => setTipoEnvio("sucursal-correo")} className={`cursor-pointer rounded-xl border-2 bg-white p-4 ${tipoEnvio === "sucursal-correo" ? "border-[#015cb9]" : "border-[#e6ecf2]"} shadow-[0_1px_2px_rgba(0,0,0,0.06)]`}>
							<p className="text-[19px] font-semibold text-[#1e1e1e]">Envío a sucursal de correo</p>
							<p className="text-sm text-[#4b5563]">Retirá en sucursal de correo.</p>
							<p className="mt-1 font-semibold text-[#001830]">${tarifa.precioSucursal.toLocaleString("es-AR")}</p>
						</div>
					</div>
				)}

				<p className="mt-4 text-[#1e1e1e]">o también podes...</p>
				<div onClick={() => setTipoEnvio("retiro-local")} className={`mt-3 cursor-pointer rounded-xl border-2 bg-white p-4 ${tipoEnvio === "retiro-local" ? "border-[#015cb9]" : "border-[#e6ecf2]"} shadow-[0_1px_2px_rgba(0,0,0,0.06)]`}>
					<p className="text-[19px] font-semibold text-[#1e1e1e]">Retirar en sucursal</p>
					<p className="text-sm text-[#4b5563]">Mitre 333 - San Nicolás de los Arroyos, Buenos Aires.</p>
					<p className="mt-1 font-semibold text-[#001830]">Sin costo de envío</p>
				</div>
			</div>

			{tipoEnvio === "domicilio" && (
				<div className="rounded-xl border border-[#dfe5eb] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
					<h3 className="text-[20px] font-bold text-[#001830]">Dirección de entrega</h3>
					<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
						<input className="h-11 rounded-lg border border-[#d5dde6] px-3 text-[15px]" placeholder="Calle" value={direccion.calle} onChange={(e) => setDireccion((s) => ({ ...s, calle: e.target.value }))} />
						<input className="h-11 rounded-lg border border-[#d5dde6] px-3 text-[15px]" placeholder="Número" value={direccion.numero} onChange={(e) => setDireccion((s) => ({ ...s, numero: e.target.value }))} />
						<input className="h-11 rounded-lg border border-[#d5dde6] px-3 text-[15px]" placeholder="Piso/Depto (opcional)" value={direccion.pisoDepto} onChange={(e) => setDireccion((s) => ({ ...s, pisoDepto: e.target.value }))} />
						<input className="h-11 rounded-lg border border-[#d5dde6] px-3 text-[15px]" placeholder="Localidad" value={direccion.localidad} onChange={(e) => setDireccion((s) => ({ ...s, localidad: e.target.value }))} />
						<input className="h-11 rounded-lg border border-[#d5dde6] px-3 text-[15px]" placeholder="Provincia" value={direccion.provincia} onChange={(e) => setDireccion((s) => ({ ...s, provincia: e.target.value }))} />
						<input className="h-11 rounded-lg border border-[#d5dde6] px-3 text-[15px]" placeholder="Código postal" value={direccion.codigoPostal} onChange={(e) => setDireccion((s) => ({ ...s, codigoPostal: e.target.value }))} />
					</div>
				</div>
			)}

			<button onClick={continuar} className="h-[46px] rounded-lg bg-[#015cb9] px-7 text-white hover:bg-[#017AF4] transition-colors">Continuar</button>
		</div>
	);
};
