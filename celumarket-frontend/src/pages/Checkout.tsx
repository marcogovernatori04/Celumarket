import { useEffect, useMemo, useState } from "react";
import { clienteService } from "../services/clienteService";
import { pedidoService, type MetodoPago } from "../services/pedidoService";
import { carritoService, type ItemCarrito } from "../services/carritoService";
import { CheckoutEnvioStep, type DatosEnvio } from "../components/checkout/CheckoutEnvioStep";
import { CheckoutFacturacionStep, type DatosFacturacion } from "../components/checkout/CheckoutFacturacionStep";
import { CheckoutPagoStep } from "../components/checkout/CheckoutPagoStep";
import { CheckoutFooter } from "../components/checkout/CheckoutFooter";
import { twCheckout } from "../styles/tw";

type CheckoutProps = {
	reservaSegundosIniciales: number;
	onVolverCarrito: () => void;
	onCompraConfirmada: (pedidoId: number) => void;
};

export const Checkout = ({ reservaSegundosIniciales, onVolverCarrito, onCompraConfirmada }: CheckoutProps) => {
	const UMBRAL_ENVIO_GRATIS = 499999;
	const [loading, setLoading] = useState(true);
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [metodos, setMetodos] = useState<MetodoPago[]>([]);
	const [carritoItems, setCarritoItems] = useState<ItemCarrito[]>([]);
	const [subtotalCarrito, setSubtotalCarrito] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [segundosRestantes, setSegundosRestantes] = useState(0);
	const [datosEnvio, setDatosEnvio] = useState<DatosEnvio | null>(null);
	const [datosFacturacion, setDatosFacturacion] = useState<DatosFacturacion | null>(null);
	const [facturacionInicial, setFacturacionInicial] = useState<DatosFacturacion>({
		nombreCompleto: "",
		dni: "",
		email: "",
		telefono: "",
	});
	const [direccionInicial, setDireccionInicial] = useState<{
		calle: string;
		numero: string;
		pisoDepto?: string;
		localidad: string;
		provincia: string;
		codigoPostal: number;
	} | undefined>();

	useEffect(() => {
		const cargar = async () => {
			try {
				const [perfil, metodosData, carrito] = await Promise.all([
					clienteService.obtenerMiPerfil(),
					pedidoService.obtenerMetodosPago(),
					carritoService.obtener(),
				]);

				setFacturacionInicial({
					nombreCompleto: perfil.nombreCompleto ?? "",
					dni: perfil.dni ?? "",
					email: perfil.email ?? "",
					telefono: perfil.telefono ?? "",
				});

				if (perfil.calleDireccion && perfil.numeroDireccion && perfil.localidadDireccion && perfil.provinciaDireccion && perfil.codigoPostalDireccion) {
					setDireccionInicial({
						calle: perfil.calleDireccion,
						numero: perfil.numeroDireccion,
						pisoDepto: perfil.pisoDeptoDireccion ?? "",
						localidad: perfil.localidadDireccion,
						provincia: perfil.provinciaDireccion,
						codigoPostal: perfil.codigoPostalDireccion,
					});
				} else if (perfil.direccionCompleta && perfil.codigoPostalDireccion) {
					const match = perfil.direccionCompleta.match(/^(.+?)\s+(\d+)(?:\s*-\s*([^,]+))?,\s*([^,]+),\s*([^(]+)\s*\((\d+)\)$/);
					if (match) {
						setDireccionInicial({
							calle: match[1].trim(),
							numero: match[2].trim(),
							pisoDepto: match[3]?.trim() ?? "",
							localidad: match[4].trim(),
							provincia: match[5].trim(),
							codigoPostal: Number(match[6]),
						});
					}
				}

				setMetodos(metodosData);
				setCarritoItems(carrito.items);
				setSubtotalCarrito(carrito.total);
			} catch {
				setError("No se pudo cargar el checkout.");
			} finally {
				setLoading(false);
			}
		};
		void cargar();
	}, []);

	useEffect(() => {
		setSegundosRestantes(Math.max(0, reservaSegundosIniciales));
	}, [reservaSegundosIniciales]);

	useEffect(() => {
		const timer = setInterval(() => {
			setSegundosRestantes((prev) => Math.max(0, prev - 1));
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const resumenEnvio = useMemo(() => {
		if (!datosEnvio) return "";
		if (datosEnvio.tipoEnvio === "domicilio") {
			const d = datosEnvio.direccionEntrega;
			return `Domicilio: ${d?.calle} ${d?.numero}${d?.pisoDepto ? ` - ${d.pisoDepto}` : ""}, ${d?.localidad}, ${d?.provincia} (CP ${d?.codigoPostal}).`;
		}
		if (datosEnvio.tipoEnvio === "sucursal-correo") {
			const t = datosEnvio.tarifa;
			if (!t) return "Sucursal de correo.";
			return `Sucursal de correo: ${t.sucursalCorreoCalle} ${t.sucursalCorreoNumero}${t.sucursalCorreoPisoDepto ? ` - ${t.sucursalCorreoPisoDepto}` : ""}, ${t.sucursalCorreoLocalidad}, ${t.sucursalCorreoProvincia} (CP ${t.sucursalCorreoCodigoPostal}).`;
		}
		return "Retiro en sucursal: Mitre 333 - San Nicolás de los Arroyos, Buenos Aires.";
	}, [datosEnvio]);

	const resumenFacturacion = useMemo(() => {
		if (!datosFacturacion) return "";
		return `${datosFacturacion.nombreCompleto} | DNI ${datosFacturacion.dni} | ${datosFacturacion.email} | ${datosFacturacion.telefono}`;
	}, [datosFacturacion]);

	const costoEnvioSeleccionado = useMemo(() => {
		if (!datosEnvio?.tarifa) return 0;
		if (subtotalCarrito >= UMBRAL_ENVIO_GRATIS) return 0;
		if (datosEnvio.tipoEnvio === "domicilio") return datosEnvio.tarifa.precioDomicilio;
		if (datosEnvio.tipoEnvio === "sucursal-correo") return datosEnvio.tarifa.precioSucursal;
		return 0;
	}, [datosEnvio, subtotalCarrito]);

	const tiempoReservaFormateado = useMemo(() => {
		const mm = Math.floor(segundosRestantes / 60).toString().padStart(2, "0");
		const ss = (segundosRestantes % 60).toString().padStart(2, "0");
		return `${mm}:${ss}`;
	}, [segundosRestantes]);

	return (
		<div className={twCheckout.checkoutShell}>
			<section className={twCheckout.checkoutSection}>
				<h1 className="text-[30px] font-extrabold leading-none text-[#001830]">Checkout</h1>
				<div className={twCheckout.checkoutTopCard}>
					<div className="flex items-center gap-2.5 text-[13px]">
						<span className={`${twCheckout.checkoutStepPillBase} ${step >= 1 ? twCheckout.checkoutStepPillActive : twCheckout.checkoutStepPillIdle}`}>1 Envío</span>
						<span className="text-[#9ca3af]">•</span>
						<span className={`${twCheckout.checkoutStepPillBase} ${step >= 2 ? twCheckout.checkoutStepPillActive : twCheckout.checkoutStepPillIdle}`}>2 Facturación</span>
						<span className="text-[#9ca3af]">•</span>
						<span className={`${twCheckout.checkoutStepPillBase} ${step >= 3 ? twCheckout.checkoutStepPillActive : twCheckout.checkoutStepPillIdle}`}>3 Pago</span>
					</div>
					<p className="mt-1.5 text-[13px] text-[#1e1e1e]">
						Reserva activa:{" "}
						<span className={segundosRestantes <= 0 ? "font-semibold text-red-600" : "font-semibold text-[#001830]"}>
							{tiempoReservaFormateado}
						</span>
					</p>
				</div>
				{error && <p className="mt-2 text-red-600">{error}</p>}
				{loading ? (
					<p className="mt-8 text-gray-600">Cargando checkout...</p>
				) : (
					<div className="mt-4 h-[calc(100%-108px)] min-h-0 overflow-hidden rounded-xl border border-[#dfe5eb] bg-[#f8fafc] p-4">
						{step === 1 && (
							<CheckoutEnvioStep
								direccionInicial={direccionInicial}
								onVolverCarrito={onVolverCarrito}
								carritoItems={carritoItems}
								subtotal={subtotalCarrito}
								onContinuar={(datos) => {
									setDatosEnvio(datos);
									setStep(2);
								}}
							/>
						)}
						{step === 2 && (
							<CheckoutFacturacionStep
								initialData={datosFacturacion ?? facturacionInicial}
								resumenEnvio={resumenEnvio}
								onVolverCarrito={onVolverCarrito}
								carritoItems={carritoItems}
								subtotal={subtotalCarrito}
								costoEnvio={costoEnvioSeleccionado}
								onVolver={() => setStep(1)}
								onContinuar={(data) => {
									setDatosFacturacion(data);
									setStep(3);
								}}
							/>
						)}
						{step === 3 && datosEnvio && (
							<CheckoutPagoStep
								metodos={metodos}
								segundosRestantes={segundosRestantes}
								datosEnvio={datosEnvio}
								resumenEnvio={resumenEnvio}
								resumenFacturacion={resumenFacturacion}
								onVolverCarrito={onVolverCarrito}
								carritoItems={carritoItems}
								subtotal={subtotalCarrito}
								costoEnvio={costoEnvioSeleccionado}
								datosFacturacion={datosFacturacion ?? facturacionInicial}
								onVolver={() => setStep(2)}
								onExito={(pedidoId) => onCompraConfirmada(pedidoId)}
							/>
						)}
					</div>
				)}
			</section>
			<CheckoutFooter />
		</div>
	);
};
