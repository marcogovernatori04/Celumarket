import { useEffect, useState } from "react";
import { carritoService, type CarritoDetalle } from "../services/carritoService";
import { Footer } from "../components/Footer";
import { pedidoService, type ReservaCheckout } from "../services/pedidoService";

type CarritoProps = {
	onCambioCarrito?: () => Promise<void> | void;
	onIrACheckout?: (reserva: ReservaCheckout) => void;
};

export const Carrito = ({ onCambioCarrito, onIrACheckout }: CarritoProps) => {
	const [carrito, setCarrito] = useState<CarritoDetalle | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [cargandoAccion, setCargandoAccion] = useState<number | null>(null);
	const [iniciandoCompra, setIniciandoCompra] = useState(false);

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

	const iniciarCompra = async () => {
		try {
			setIniciandoCompra(true);
			const reserva = await pedidoService.iniciarCompra();
			onIrACheckout?.(reserva);
		} catch {
			setError("No se pudo iniciar la compra. Verificá stock y volvé a intentar.");
		} finally {
			setIniciandoCompra(false);
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
						</div>

						<div className="border-l border-black/10 pl-10">
							<div className="rounded-md bg-white p-4 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
								<p className="text-[24px] font-medium text-[#1e1e1e]">Subtotal: ${carrito.total.toLocaleString("es-AR")}</p>
								<p className="text-[18px] text-[#757575]">{carrito.items.length} artículo{carrito.items.length > 1 ? "s" : ""}</p>
								<div className="my-2 h-px bg-[#d9d9d9]" />
								<p className="text-[28px] font-semibold text-[#1e1e1e]">Total parcial: ${carrito.total.toLocaleString("es-AR")}</p>
							</div>
							<button
								disabled={iniciandoCompra}
								onClick={iniciarCompra}
								className={`mt-4 h-[44px] w-full rounded-md text-[21px] transition-colors duration-200 ${!iniciandoCompra ? "bg-[#015cb9] text-white hover:bg-[#017AF4]" : "bg-[#757575] text-[#d9d9d9]"}`}
							>
								{iniciandoCompra ? "Iniciando..." : "Iniciar compra"}
							</button>
							<div className="mt-4 rounded-md border border-[#cfe0f3] bg-[#eef5fd] p-4 text-[#1f3f62] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
								<p className="text-[15px] leading-tight">Información: en el checkout vas a elegir envío, datos de facturación y método de pago.</p>
							</div>
						</div>
					</div>
				)}
			</section>
			<Footer />
		</div>
	);
};
