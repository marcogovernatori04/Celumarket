import { useEffect, useMemo, useState } from "react";
import { Footer } from "../components/Footer";
import { clienteService } from "../services/clienteService";
import { pedidoService, type MetodoPago } from "../services/pedidoService";
import { CheckoutEnvioStep, type DatosEnvio } from "../components/checkout/CheckoutEnvioStep";
import { CheckoutFacturacionStep, type DatosFacturacion } from "../components/checkout/CheckoutFacturacionStep";
import { CheckoutPagoStep } from "../components/checkout/CheckoutPagoStep";

type CheckoutProps = {
	reservaVencimientoUtc: string;
	onVolverCarrito: () => void;
};

export const Checkout = ({ reservaVencimientoUtc, onVolverCarrito }: CheckoutProps) => {
	const [loading, setLoading] = useState(true);
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [metodos, setMetodos] = useState<MetodoPago[]>([]);
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
				const [perfil, metodosData] = await Promise.all([
					clienteService.obtenerMiPerfil(),
					pedidoService.obtenerMetodosPago(),
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
				}

				setMetodos(metodosData);
			} catch {
				setError("No se pudo cargar el checkout.");
			} finally {
				setLoading(false);
			}
		};
		void cargar();
	}, []);

	useEffect(() => {
		const tick = () => {
			const diff = Math.floor((new Date(reservaVencimientoUtc).getTime() - Date.now()) / 1000);
			setSegundosRestantes(Math.max(0, diff));
		};
		tick();
		const timer = setInterval(tick, 1000);
		return () => clearInterval(timer);
	}, [reservaVencimientoUtc]);

	const resumenEnvio = useMemo(() => {
		if (!datosEnvio) return "";
		if (datosEnvio.tipoEnvio === "domicilio") {
			const d = datosEnvio.direccionEntrega;
			return `Domicilio: ${d?.calle} ${d?.numero}${d?.pisoDepto ? ` - ${d.pisoDepto}` : ""}, ${d?.localidad}, ${d?.provincia} (CP ${d?.codigoPostal}).`;
		}
		if (datosEnvio.tipoEnvio === "sucursal-correo") {
			return `Sucursal de correo para CP ${datosEnvio.tarifa?.codigoPostal ?? "-"}.`;
		}
		return "Retiro en sucursal: Mitre 333 - San Nicolás de los Arroyos, Buenos Aires.";
	}, [datosEnvio]);

	const resumenFacturacion = useMemo(() => {
		if (!datosFacturacion) return "";
		return `${datosFacturacion.nombreCompleto} | DNI ${datosFacturacion.dni} | ${datosFacturacion.email} | ${datosFacturacion.telefono}`;
	}, [datosFacturacion]);

	return (
		<div className="min-h-screen bg-[#f5f5f5] flex flex-col">
			<section className="mx-auto w-full max-w-[1120px] flex-1 px-6 py-8">
				<h1 className="text-[34px] font-extrabold leading-none text-[#001830]">Checkout</h1>
				<div className="mt-5 rounded-xl border border-[#dfe5eb] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
					<div className="flex items-center gap-3 text-sm">
						<span className={`rounded-full px-3 py-1 font-semibold ${step >= 1 ? "bg-[#015cb9] text-white" : "bg-[#edf2f7] text-[#6b7280]"}`}>1 Envío</span>
						<span className="text-[#9ca3af]">•</span>
						<span className={`rounded-full px-3 py-1 font-semibold ${step >= 2 ? "bg-[#015cb9] text-white" : "bg-[#edf2f7] text-[#6b7280]"}`}>2 Facturación</span>
						<span className="text-[#9ca3af]">•</span>
						<span className={`rounded-full px-3 py-1 font-semibold ${step >= 3 ? "bg-[#015cb9] text-white" : "bg-[#edf2f7] text-[#6b7280]"}`}>3 Pago</span>
					</div>
				</div>
				{error && <p className="mt-2 text-red-600">{error}</p>}
				{loading ? (
					<p className="mt-8 text-gray-600">Cargando checkout...</p>
				) : (
					<div className="mt-6 rounded-xl border border-[#dfe5eb] bg-[#f8fafc] p-5">
						{step === 1 && (
							<CheckoutEnvioStep
								direccionInicial={direccionInicial}
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
								onVolver={() => setStep(2)}
								onExito={(pedidoId) => {
									alert(`Pedido #${pedidoId} generado correctamente.`);
									onVolverCarrito();
								}}
							/>
						)}
						<button onClick={onVolverCarrito} className="mt-6 h-[40px] rounded-lg border border-[#001830] px-5 text-[#001830] hover:bg-[#eef4fb] transition-colors">Volver al carrito</button>
					</div>
				)}
			</section>
			<Footer />
		</div>
	);
};
