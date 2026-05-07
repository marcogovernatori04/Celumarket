import { useEffect, useState } from "react";
import { carritoService, type CarritoDetalle } from "../services/carritoService";
import { Footer } from "../components/Footer";
import { tarifaService, type TarifaPorCodigoPostal } from "../services/tarifaService";

type CarritoProps = {
	onCambioCarrito?: () => Promise<void> | void;
	direccionCliente?: string | null;
	codigoPostalDireccionCliente?: number | null;
};

export const Carrito = ({ onCambioCarrito, direccionCliente, codigoPostalDireccionCliente }: CarritoProps) => {
	const [carrito, setCarrito] = useState<CarritoDetalle | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [codigoPostal, setCodigoPostal] = useState("");
	const [cargandoAccion, setCargandoAccion] = useState<number | null>(null);
	const direccionSucursal = "Mitre 333 - San Nicolás de los Arroyos, Buenos Aires";
	const [tarifa, setTarifa] = useState<TarifaPorCodigoPostal | null>(null);
	const [errorTarifa, setErrorTarifa] = useState<string | null>(null);
	const [tipoEnvioSeleccionado, setTipoEnvioSeleccionado] = useState<"domicilio" | "sucursal-correo" | "retiro-local" | null>(null);
	const tieneDireccionParaCp =
		Boolean(direccionCliente) &&
		codigoPostalDireccionCliente != null &&
		tarifa != null &&
		codigoPostalDireccionCliente === tarifa.codigoPostal;
	const costoEnvioSeleccionado =
		tipoEnvioSeleccionado === "domicilio"
			? (tarifa?.precioDomicilio ?? 0)
			: tipoEnvioSeleccionado === "sucursal-correo"
				? (tarifa?.precioSucursal ?? 0)
				: 0;
	const totalConEnvio = (carrito?.total ?? 0) + costoEnvioSeleccionado;

	const cargarCarrito = async () => {
		try {
			const data = await carritoService.obtener();
			setCarrito(data);
		} catch {
			setError("No se pudo cargar el carrito.");
		}
	};

	useEffect(() => {
		void cargarCarrito();
	}, []);

	const sumar = async (variacionId: number) => {
		setCargandoAccion(variacionId);
		await carritoService.agregarItem(variacionId, 1);
		await cargarCarrito();
		await onCambioCarrito?.();
		setCargandoAccion(null);
	};

	const restar = async (variacionId: number) => {
		setCargandoAccion(variacionId);
		await carritoService.restarItem(variacionId);
		await cargarCarrito();
		await onCambioCarrito?.();
		setCargandoAccion(null);
	};

	const eliminar = async (variacionId: number) => {
		setCargandoAccion(variacionId);
		await carritoService.eliminarItem(variacionId);
		await cargarCarrito();
		await onCambioCarrito?.();
		setCargandoAccion(null);
	};

	const abrirGoogleMaps = () => {
		const query = encodeURIComponent(direccionSucursal);
		window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank", "noopener,noreferrer");
	};

	const buscarTarifa = async () => {
		setErrorTarifa(null);
		setTarifa(null);
		setTipoEnvioSeleccionado(null);

		const cp = Number(codigoPostal);
		if (!Number.isInteger(cp) || cp <= 0) {
			setErrorTarifa("Ingresá un código postal válido.");
			return;
		}

		try {
			const data = await tarifaService.obtenerPorCodigoPostal(cp);
			setTarifa(data);
		} catch {
			setErrorTarifa("No encontramos tarifas para ese código postal.");
		}
	};

	return (
		<div className="min-h-screen bg-[#f5f5f5] flex flex-col">
			<section className="mx-auto w-full max-w-[1080px] flex-1 px-6 py-8">
				<h1 className="mb-7 text-3xl font-extrabold text-[#001830]">Tu carrito</h1>
				{error && <p className="text-red-600">{error}</p>}
				{!error && !carrito && <p className="text-gray-600">Cargando carrito...</p>}
				{carrito && carrito.items.length === 0 && <p className="text-gray-600">Tu carrito está vacío.</p>}
				{carrito && carrito.items.length > 0 && (
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
						<div className="lg:pr-6">
							<div className="space-y-5">
								{carrito.items.map((item) => (
									<div key={item.variacionId} className="rounded-md bg-white p-3.5 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
										<div className="grid grid-cols-[132px_1fr_48px] items-center gap-3">
											<div className="h-[132px] w-[132px] overflow-hidden rounded-md bg-[#ececec]">
												<img src={item.urlImagen} alt={`${item.marca} ${item.modelo}`} className="h-[132px] w-[132px] scale-125 object-contain" />
											</div>
											<div>
												<p className="text-[22px] font-medium leading-tight text-[#1e1e1e]">{item.marca} {item.modelo}</p>
												<p className="mt-1 text-base text-[#6a6a6a]">Color: {item.color}</p>
												<p className="mt-2 text-[24px] font-semibold leading-none text-[#1e1e1e]">
													${(item.precioUnitario * item.cantidad).toLocaleString("es-AR")}
												</p>
												<button onClick={() => eliminar(item.variacionId)} className="mt-2 text-sm text-[#001830] underline hover:text-[#015cb9]">
													Eliminar
												</button>
											</div>
											<div className="flex h-[104px] flex-col items-center justify-between rounded-md border border-black/25 py-2">
												<button disabled={cargandoAccion === item.variacionId || item.cantidad <= 1} onClick={() => restar(item.variacionId)} className="text-2xl leading-none text-[#001830] hover:opacity-70 disabled:opacity-30">−</button>
												<p className="text-2xl font-medium text-[#1e1e1e]">{item.cantidad}</p>
												<button disabled={cargandoAccion === item.variacionId} onClick={() => sumar(item.variacionId)} className="text-3xl leading-none text-[#001830] hover:opacity-70">+</button>
											</div>
										</div>
									</div>
								))}
							</div>

							<h2 className="mt-8 text-3xl font-extrabold text-[#001830]">Elegí tu método de envío</h2>
							<p className="mt-3 text-lg text-[#1e1e1e]">Ingresá tu código postal:</p>
							<div className="mt-4 max-w-[560px]">
								<div className="flex items-center gap-2">
									<div className="relative flex-1">
										<input
											value={codigoPostal}
											onChange={(e) => setCodigoPostal(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													void buscarTarifa();
												}
											}}
											className="h-10 w-full rounded-full border border-[#d9d9d9] bg-white px-4 pr-10 text-base"
										/>
										<button onClick={buscarTarifa} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">⌕</button>
									</div>
									<button onClick={buscarTarifa} className="h-10 rounded-md bg-[#015cb9] px-4 text-sm text-white hover:bg-[#017AF4] transition-colors duration-200">
										Buscar
									</button>
								</div>
								{errorTarifa && <p className="mt-2 text-sm text-red-600">{errorTarifa}</p>}
							</div>
							{tarifa && (
								<div
									onClick={() => setTipoEnvioSeleccionado("domicilio")}
									className={`mt-4 max-w-[760px] cursor-pointer rounded-md bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15)] border-2 ${tipoEnvioSeleccionado === "domicilio" ? "border-[#015cb9]" : "border-transparent"}`}
								>
									<h3 className="text-3xl font-medium leading-none text-[#1e1e1e]">Envío a domicilio</h3>
									<p className="mt-2 text-sm text-[#4b5563]">
										{tieneDireccionParaCp
											? "Ya tienes una dirección guardada en este código postal."
											: "La dirección de entrega se completará en el checkout."}
									</p>
									<p className="mt-3 text-base text-[#1e1e1e]">
										Llega en aproximadamente {tarifa.diasDemora} día{tarifa.diasDemora > 1 ? "s" : ""}.
									</p>
									<p className="mt-2 text-xl font-semibold text-[#001830]">
										${tarifa.precioDomicilio.toLocaleString("es-AR")}
									</p>
								</div>
							)}
							{tarifa && (
								<div
									onClick={() => setTipoEnvioSeleccionado("sucursal-correo")}
									className={`mt-4 max-w-[760px] cursor-pointer rounded-md bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15)] border-2 ${tipoEnvioSeleccionado === "sucursal-correo" ? "border-[#015cb9]" : "border-transparent"}`}
								>
									<h3 className="text-3xl font-medium leading-none text-[#1e1e1e]">Envío a sucursal de correo</h3>
									<p className="mt-3 text-base text-[#1e1e1e]">
										Retirá en sucursal de correo en aproximadamente {tarifa.diasDemora} día{tarifa.diasDemora > 1 ? "s" : ""}.
									</p>
									<p className="mt-2 text-xl font-semibold text-[#001830]">
										${tarifa.precioSucursal.toLocaleString("es-AR")}
									</p>
								</div>
							)}
							<p className="mt-3 text-lg text-[#1e1e1e]">o también podes...</p>
							<div
								onClick={() => setTipoEnvioSeleccionado("retiro-local")}
								className={`mt-4 max-w-[760px] cursor-pointer rounded-md bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15)] border-2 ${tipoEnvioSeleccionado === "retiro-local" ? "border-[#015cb9]" : "border-transparent"}`}
							>
								<h3 className="text-3xl font-medium leading-none text-[#1e1e1e]">Retirar en sucursal</h3>
								<p className="mt-3 text-base text-[#1e1e1e]">{direccionSucursal}</p>
								<p className="text-base text-[#1e1e1e]">Lunes a Viernes de 8 a 12 y de 16 a 20 / Sábados de 8 a 12</p>
								<p className="mt-2 text-xl font-semibold text-[#001830]">Sin costo de envío</p>
								<button onClick={abrirGoogleMaps} className="mt-4 rounded-md bg-[#015cb9] px-4 py-2 text-sm text-white underline hover:bg-[#017AF4] transition-colors duration-200">Ver en Google Maps</button>
							</div>
						</div>

						<div className="border-l border-black/10 pl-10">
							<div className="rounded-md bg-white p-4 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
								<p className="text-[24px] font-medium text-[#1e1e1e]">Subtotal: ${carrito.total.toLocaleString("es-AR")}</p>
								<p className="text-[18px] text-[#757575]">{carrito.items.length} artículo{carrito.items.length > 1 ? "s" : ""}</p>
								<p className="text-[18px] text-[#757575]">Envío: ${costoEnvioSeleccionado.toLocaleString("es-AR")}</p>
								<div className="my-2 h-px bg-[#d9d9d9]" />
								<p className="text-[28px] font-semibold text-[#1e1e1e]">Total: ${totalConEnvio.toLocaleString("es-AR")}</p>
							</div>
							<button
								disabled={!tipoEnvioSeleccionado}
								className={`mt-4 h-[44px] w-full rounded-md text-[21px] transition-colors duration-200 ${tipoEnvioSeleccionado ? "bg-[#015cb9] text-white hover:bg-[#017AF4]" : "bg-[#757575] text-[#d9d9d9]"}`}
							>
								Iniciar compra
							</button>
							<div className="mt-4 rounded-md bg-[#001830] p-4 text-white shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
								<p className="text-[16px] leading-tight">
									{tipoEnvioSeleccionado
										? `Método seleccionado: ${tipoEnvioSeleccionado === "domicilio" ? "Envío a domicilio" : tipoEnvioSeleccionado === "sucursal-correo" ? "Envío a sucursal de correo" : "Retiro en sucursal"}`
										: "Seleccioná un método de envío para iniciar tu compra."}
								</p>
							</div>
						</div>
					</div>
				)}
			</section>
			<Footer />
		</div>
	);
};
