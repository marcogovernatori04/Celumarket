import { useEffect, useState } from "react";
import { tarifaService, type TarifaPorCodigoPostal } from "../../services/tarifaService";
import type { ItemCarrito } from "../../services/carritoService";
import { CheckoutSidebarActions } from "./CheckoutSidebarActions";

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
	onVolverCarrito: () => void;
	carritoItems: ItemCarrito[];
	subtotal: number;
};

export const CheckoutEnvioStep = ({ direccionInicial, onContinuar, onVolverCarrito, carritoItems, subtotal }: Props) => {
	const UMBRAL_ENVIO_GRATIS = 499999;
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
	const tieneDireccionGuardada = Boolean(
		direccionInicial?.calle &&
		direccionInicial?.numero &&
		direccionInicial?.localidad &&
		direccionInicial?.provincia &&
		direccionInicial?.codigoPostal
	);
	const [modoDireccion, setModoDireccion] = useState<"guardada" | "nueva">(tieneDireccionGuardada ? "guardada" : "nueva");

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

	useEffect(() => {
		if (direccionInicial?.codigoPostal) {
			void (async () => {
				try {
					const data = await tarifaService.obtenerPorCodigoPostal(direccionInicial.codigoPostal);
					setTarifa(data);
				} catch {
					// Si no hay tarifa para ese CP, el usuario puede buscar manualmente.
				}
			})();
		}
	}, [direccionInicial?.codigoPostal]);

	const continuar = () => {
		if (!tipoEnvio) return;
		if (tipoEnvio !== "retiro-local" && !tarifa) return;

		if (tipoEnvio === "domicilio") {
			const direccionAUsar = modoDireccion === "guardada" && direccionInicial
				? {
					calle: direccionInicial.calle,
					numero: direccionInicial.numero,
					pisoDepto: direccionInicial.pisoDepto ?? "",
					localidad: direccionInicial.localidad,
					provincia: direccionInicial.provincia,
					codigoPostal: String(direccionInicial.codigoPostal),
				}
				: direccion;

			if (!direccionAUsar.calle || !direccionAUsar.numero || !direccionAUsar.localidad || !direccionAUsar.provincia || !direccionAUsar.codigoPostal) {
				setErrorTarifa("Completá la dirección de entrega para envío a domicilio.");
				return;
			}

			onContinuar({
				tipoEnvio,
				tarifa,
				direccionEntrega: {
					calle: direccionAUsar.calle,
					numero: direccionAUsar.numero,
					pisoDepto: direccionAUsar.pisoDepto || undefined,
					localidad: direccionAUsar.localidad,
					provincia: direccionAUsar.provincia,
					codigoPostal: Number(direccionAUsar.codigoPostal),
				},
			});
			return;
		}

		onContinuar({ tipoEnvio, tarifa });
	};

	const resumenSeleccion =
		tipoEnvio === "domicilio" && tarifa
			? `Elegiste envío a domicilio (${subtotal >= UMBRAL_ENVIO_GRATIS ? "Gratis" : `$${tarifa.precioDomicilio.toLocaleString("es-AR")}`})`
			: tipoEnvio === "sucursal-correo" && tarifa
				? `Elegiste envío a sucursal de Andreani (${subtotal >= UMBRAL_ENVIO_GRATIS ? "Gratis" : `$${tarifa.precioSucursal.toLocaleString("es-AR")}`})`
					: tipoEnvio === "retiro-local"
						? "Elegiste retirar en sucursal (Sin costo)"
						: "Seleccioná envío para continuar.";
	const costoEnvioSeleccionado =
		subtotal >= UMBRAL_ENVIO_GRATIS
			? 0
			: tipoEnvio === "domicilio" && tarifa
			? tarifa.precioDomicilio
			: tipoEnvio === "sucursal-correo" && tarifa
				? tarifa.precioSucursal
				: 0;
	const totalConEnvio = subtotal + costoEnvioSeleccionado;
	const puedeContinuar =
		Boolean(tipoEnvio) &&
		(tipoEnvio === "retiro-local" ||
			Boolean(tarifa)) &&
		(tipoEnvio !== "domicilio" ||
			(modoDireccion === "guardada"
				? tieneDireccionGuardada
				: (Boolean(direccion.calle) &&
					Boolean(direccion.numero) &&
					Boolean(direccion.localidad) &&
					Boolean(direccion.provincia) &&
					Boolean(direccion.codigoPostal))));

	return (
		<div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
			<div className="h-full min-h-0 space-y-3">
				<div className="flex h-full min-h-0 flex-col rounded-xl border border-[#dfe5eb] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
					<h2 className="text-2xl font-bold text-[#001830]">1. Elegí tu envío</h2>
					<p className="mt-2 text-[15px] text-[#1e1e1e]">Ingresá tu código postal:</p>
					<div className="mt-2 flex items-center gap-2">
						<input value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} className="h-9 flex-1 rounded-full border border-[#d5dde6] bg-white px-4 text-[14px]" />
						<button onClick={buscarTarifa} className="h-9 rounded-lg bg-[#015cb9] px-4 text-sm text-white hover:bg-[#017AF4] transition-colors">Buscar</button>
					</div>
					{errorTarifa && <p className="mt-2 text-sm text-red-600">{errorTarifa}</p>}
					<div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">

						{tarifa && (
							<div className="space-y-3">
								<div className={`rounded-xl border-2 bg-white p-3 ${tipoEnvio === "domicilio" ? "border-[#015cb9]" : "border-[#e6ecf2]"} shadow-[0_1px_2px_rgba(0,0,0,0.06)]`}>
									<div onClick={() => setTipoEnvio("domicilio")} className="cursor-pointer">
									<p className="text-[17px] font-semibold text-[#1e1e1e]">Envío a domicilio</p>
									<p className="text-sm text-[#4b5563]">Llega en aprox. {tarifa.diasDemora} día{tarifa.diasDemora > 1 ? "s" : ""}.</p>
									<p className={`mt-1.5 text-[20px] font-extrabold leading-none ${subtotal >= UMBRAL_ENVIO_GRATIS ? "text-[#1E8E5A]" : "text-[#001830]"}`}>
										{subtotal >= UMBRAL_ENVIO_GRATIS ? "Gratis" : `$${tarifa.precioDomicilio.toLocaleString("es-AR")}`}
									</p>
									</div>

										<div
											className={`overflow-hidden transition-all duration-300 ease-out ${tipoEnvio === "domicilio" ? "mt-3 max-h-[420px] border-t border-[#e6ecf2] pt-3 opacity-100" : "max-h-0 border-t-0 pt-0 opacity-0"}`}
										>
												<h3 className="text-[16px] font-bold text-[#001830]">Dirección de entrega</h3>
												{tieneDireccionGuardada && (
													<div className="mt-2 rounded-lg border border-[#dfe5eb] bg-[#f8fafc] p-2.5">
														<p className="text-[13px] font-semibold text-[#1e1e1e]">Dirección para este pedido</p>
														<div className="mt-2 flex flex-col gap-2 text-sm">
															<label className="inline-flex items-center gap-2">
																<input
																	type="radio"
																	name="modoDireccion"
																	checked={modoDireccion === "guardada"}
																	onChange={() => setModoDireccion("guardada")}
																/>
																<span>Usar dirección guardada</span>
															</label>
															<label className="inline-flex items-center gap-2">
																<input
																	type="radio"
																	name="modoDireccion"
																	checked={modoDireccion === "nueva"}
																	onChange={() => setModoDireccion("nueva")}
																/>
																<span>Ingresar otra dirección</span>
															</label>
														</div>
														{modoDireccion === "guardada" && (
															<p className="mt-2 text-sm text-[#4b5563]">
																{direccionInicial?.calle} {direccionInicial?.numero}
																{direccionInicial?.pisoDepto ? ` - ${direccionInicial.pisoDepto}` : ""}, {direccionInicial?.localidad}, {direccionInicial?.provincia} ({direccionInicial?.codigoPostal})
															</p>
														)}
													</div>
												)}
												{(!tieneDireccionGuardada || modoDireccion === "nueva") && (
													<div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
														<input className="h-10 rounded-lg border border-[#d5dde6] px-3 text-[14px]" placeholder="Calle" value={direccion.calle} onChange={(e) => setDireccion((s) => ({ ...s, calle: e.target.value }))} />
														<input className="h-10 rounded-lg border border-[#d5dde6] px-3 text-[14px]" placeholder="Número" value={direccion.numero} onChange={(e) => setDireccion((s) => ({ ...s, numero: e.target.value }))} />
														<input className="h-10 rounded-lg border border-[#d5dde6] px-3 text-[14px]" placeholder="Piso/Depto (opcional)" value={direccion.pisoDepto} onChange={(e) => setDireccion((s) => ({ ...s, pisoDepto: e.target.value }))} />
														<input className="h-10 rounded-lg border border-[#d5dde6] px-3 text-[14px]" placeholder="Localidad" value={direccion.localidad} onChange={(e) => setDireccion((s) => ({ ...s, localidad: e.target.value }))} />
														<input className="h-10 rounded-lg border border-[#d5dde6] px-3 text-[14px]" placeholder="Provincia" value={direccion.provincia} onChange={(e) => setDireccion((s) => ({ ...s, provincia: e.target.value }))} />
														<input className="h-10 rounded-lg border border-[#d5dde6] px-3 text-[14px]" placeholder="Código postal" value={direccion.codigoPostal} onChange={(e) => setDireccion((s) => ({ ...s, codigoPostal: e.target.value }))} />
													</div>
												)}
										</div>
									</div>

							<div onClick={() => setTipoEnvio("sucursal-correo")} className={`cursor-pointer rounded-xl border-2 bg-white p-3 ${tipoEnvio === "sucursal-correo" ? "border-[#015cb9]" : "border-[#e6ecf2]"} shadow-[0_1px_2px_rgba(0,0,0,0.06)]`}>
								<p className="text-[17px] font-semibold text-[#1e1e1e]">Envío a sucursal de correo</p>
								<p className="text-sm text-[#4b5563]">Retirá en sucursal de Andreani.</p>
								{tarifa.sucursalCorreoCalle && (
									<p className="mt-1 text-sm text-[#4b5563]">
										{tarifa.sucursalCorreoCalle} {tarifa.sucursalCorreoNumero}
										{tarifa.sucursalCorreoPisoDepto ? ` - ${tarifa.sucursalCorreoPisoDepto}` : ""}, {tarifa.sucursalCorreoLocalidad}, {tarifa.sucursalCorreoProvincia} ({tarifa.sucursalCorreoCodigoPostal})
									</p>
								)}
									<p className={`mt-1.5 text-[20px] font-extrabold leading-none ${subtotal >= UMBRAL_ENVIO_GRATIS ? "text-[#1E8E5A]" : "text-[#001830]"}`}>
										{subtotal >= UMBRAL_ENVIO_GRATIS ? "Gratis" : `$${tarifa.precioSucursal.toLocaleString("es-AR")}`}
									</p>
							</div>
							</div>
						)}

					<p className="mt-3 text-[15px] text-[#1e1e1e]">o también podes...</p>
					<div onClick={() => setTipoEnvio("retiro-local")} className={`mt-2 cursor-pointer rounded-xl border-2 bg-white p-3 ${tipoEnvio === "retiro-local" ? "border-[#015cb9]" : "border-[#e6ecf2]"} shadow-[0_1px_2px_rgba(0,0,0,0.06)]`}>
						<p className="text-[17px] font-semibold text-[#1e1e1e]">Retirar en sucursal</p>
						<p className="text-sm text-[#4b5563]">Mitre 333 - San Nicolás de los Arroyos, Buenos Aires.</p>
						<p className="mt-1.5 text-[20px] font-extrabold leading-none text-[#001830]">Sin costo de envío</p>
					</div>
					</div>
				</div>

			</div>
				<CheckoutSidebarActions
					pasoLabel="Paso 1 de 3"
					descripcion={resumenSeleccion}
					items={carritoItems}
					subtotal={subtotal}
					costoEnvio={costoEnvioSeleccionado}
					total={totalConEnvio}
					primaryLabel="Continuar"
					onPrimary={continuar}
					primaryDisabled={!puedeContinuar}
					onVolverCarrito={onVolverCarrito}
				/>
				</div>
			);
		};
