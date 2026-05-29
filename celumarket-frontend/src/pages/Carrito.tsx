import { useEffect, useState } from "react";
import { carritoService, type CarritoDetalle } from "../services/carritoService";
import { Footer } from "../components/Footer";
import { pedidoService, type ReservaCheckout } from "../services/pedidoService";
import { twBase, twCarrito } from "../styles/tw";

type CarritoProps = {
	onCambioCarrito?: () => Promise<void> | void;
	onIrACheckout?: (reserva: ReservaCheckout) => void;
	onIrATienda?: () => void;
};

export const Carrito = ({ onCambioCarrito, onIrACheckout, onIrATienda }: CarritoProps) => {
	const [carrito, setCarrito] = useState<CarritoDetalle | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [cargandoAccion, setCargandoAccion] = useState<number | null>(null);
	const [iniciandoCompra, setIniciandoCompra] = useState(false);
	const [vaciandoCarrito, setVaciandoCarrito] = useState(false);
	const [mostrarModalVaciar, setMostrarModalVaciar] = useState(false);

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

	const vaciarCarrito = async () => {
		try {
			setVaciandoCarrito(true);
			await carritoService.vaciar();
			await cargarCarrito();
			await onCambioCarrito?.();
			setMostrarModalVaciar(false);
		} catch {
			setError("No se pudo vaciar el carrito.");
		} finally {
			setVaciandoCarrito(false);
		}
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
		<div className={twCarrito.layout}>
			<section className={twCarrito.section}>
				<h1 className="mb-6 text-2xl font-extrabold text-[#001830] sm:mb-7 sm:text-3xl">Tu carrito</h1>
				{error && <p className="text-red-600">{error}</p>}
				{!error && !carrito && <p className="text-gray-600">Cargando carrito...</p>}
				{carrito && carrito.items.length === 0 && (
		<div className={twCarrito.emptyWrap}>
						<div className={twCarrito.emptyCard}>
							<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf2fb] text-2xl text-[#015cb9]">
								🛒
							</div>
							<p className="text-2xl font-semibold text-[#001830]">Tu carrito está vacío</p>
							<p className="mt-2 text-[16px] text-[#5b6673]">Agregá productos para comenzar tu compra.</p>
							<button
								onClick={onIrATienda}
								className={`mt-6 ${twBase.primaryBtnMd}`}
							>
								Ir a la tienda
							</button>
						</div>
					</div>
				)}
				{carrito && carrito.items.length > 0 && (
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
						<div className="min-w-0 lg:pr-6">
							<div className="space-y-5">
								{carrito.items.map((item) => (
									<div key={item.variacionId} className={twCarrito.itemCard}>
										<div className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[132px_minmax(0,1fr)_48px]">
											<div className="h-[92px] w-[92px] overflow-hidden rounded-md bg-[#ececec] sm:h-[132px] sm:w-[132px]">
												<img src={item.urlImagen} alt={`${item.marca} ${item.modelo}`} className="h-full w-full scale-125 object-contain" />
											</div>
											<div className="min-w-0">
												<p className="break-words text-[18px] font-medium leading-tight text-[#1e1e1e] sm:text-[22px]">{item.marca} {item.modelo}</p>
												<p className="mt-1 text-sm text-[#6a6a6a] sm:text-base">Color: {item.color}</p>
												<p className="mt-2 text-[20px] font-semibold leading-none text-[#1e1e1e] sm:text-[24px]">
													${(item.precioUnitario * item.cantidad).toLocaleString("es-AR")}
												</p>
												<button onClick={() => eliminar(item.variacionId)} className="mt-2 text-sm text-[#001830] underline hover:text-[#015cb9]">
													Eliminar
												</button>
											</div>
											<div className="col-span-2 flex h-11 w-full items-center justify-center gap-4 rounded-md border border-black/25 px-3 sm:col-span-1 sm:h-[104px] sm:w-auto sm:flex-col sm:justify-between sm:gap-0 sm:px-0 sm:py-2">
												<button disabled={cargandoAccion === item.variacionId || item.cantidad <= 1} onClick={() => restar(item.variacionId)} className="flex h-8 w-8 items-center justify-center text-2xl leading-none text-[#001830] hover:opacity-70 disabled:opacity-30">−</button>
												<p className="min-w-8 text-center text-xl font-medium text-[#1e1e1e] sm:text-2xl">{item.cantidad}</p>
												<button disabled={cargandoAccion === item.variacionId} onClick={() => sumar(item.variacionId)} className="flex h-8 w-8 items-center justify-center text-3xl leading-none text-[#001830] hover:opacity-70">+</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="min-w-0 border-t border-black/10 pt-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
							<div className={twCarrito.summaryCard}>
								<p className="text-[20px] font-medium text-[#1e1e1e] sm:text-[24px]">Subtotal: ${carrito.total.toLocaleString("es-AR")}</p>
								<p className="text-base text-[#757575] sm:text-[18px]">{carrito.items.length} artículo{carrito.items.length > 1 ? "s" : ""}</p>
								<div className="my-2 h-px bg-[#d9d9d9]" />
								<p className="text-[22px] font-semibold text-[#1e1e1e] sm:text-[28px]">Total parcial: ${carrito.total.toLocaleString("es-AR")}</p>
							</div>
							<button
								disabled={iniciandoCompra}
								onClick={iniciarCompra}
								className={`${twCarrito.checkoutBtn} ${!iniciandoCompra ? "bg-[#015cb9] text-white hover:bg-[#017AF4]" : "bg-[#757575] text-[#d9d9d9]"}`}
							>
								{iniciandoCompra ? "Iniciando..." : "Iniciar compra"}
							</button>
							<button
								disabled={vaciandoCarrito || iniciandoCompra}
								onClick={() => setMostrarModalVaciar(true)}
								className={twCarrito.secondaryBtn}
							>
								{vaciandoCarrito ? "Vaciando..." : "Vaciar carrito"}
							</button>
							<div className={twCarrito.infoBox}>
								<p className="text-[15px] leading-tight">Información: en el checkout vas a elegir envío, datos de facturación y método de pago.</p>
							</div>
						</div>
					</div>
				)}
			</section>
			{mostrarModalVaciar && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
					<div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
						<h2 className="text-xl font-semibold text-[#001830]">Vaciar carrito</h2>
						<p className="mt-2 text-[15px] text-[#4b5563]">
							Se van a eliminar todos los productos del carrito. ¿Querés continuar?
						</p>
						<div className="mt-5 flex justify-end gap-2">
							<button
								disabled={vaciandoCarrito}
								onClick={() => setMostrarModalVaciar(false)}
								className="h-[38px] rounded-md border border-black/15 bg-[#eef1f4] px-4 text-[15px] text-[#001830] hover:bg-[#e2e7ec] disabled:opacity-60"
							>
								Cancelar
							</button>
							<button
								disabled={vaciandoCarrito}
								onClick={vaciarCarrito}
								className={`${twBase.actionBtnPrimary} h-[38px] px-4 text-[15px] disabled:opacity-60`}
							>
								{vaciandoCarrito ? "Vaciando..." : "Vaciar carrito"}
							</button>
						</div>
					</div>
				</div>
			)}
			<Footer />
		</div>
	);
};
