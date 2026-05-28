import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { NavbarLogin } from "./components/NavbarLogin";
import { Landing } from "./pages/Landing";
import { Contacto } from "./pages/Contacto";
import { PreguntasFrecuentes } from "./pages/PreguntasFrecuentes";
import { Catalogo } from "./pages/Catalogo";
import { DetalleCelular } from "./pages/DetalleCelular";
import { Login } from "./pages/Login";
import { Carrito } from "./pages/Carrito";
import { Checkout } from "./pages/Checkout";
import { CambiarClave } from "./pages/CambiarClave";
import { MiPerfil } from "./pages/MiPerfil";
import { MisPedidos } from "./pages/MisPedidos";
import { DetallePedido } from "./pages/DetallePedido";
import { CompraConfirmada } from "./pages/CompraConfirmada";
import { ResultadoPago } from "./pages/ResultadoPago";
import { AdminPanel } from "./pages/AdminPanel";
import { authService } from "./services/authService";
import { clienteService } from "./services/clienteService";
import { carritoService } from "./services/carritoService";
import { pedidoService, type DetallePedido as DetallePedidoResponse, type ReservaCheckout } from "./services/pedidoService";

type CheckoutLocationState = {
	reservaSegundosRestantes?: number;
};

function App() {
	const navigate = useNavigate();
	const location = useLocation();
	const [estaLogueado, setEstaLogueado] = useState(authService.estaLogueado());
	const [esAdmin, setEsAdmin] = useState(authService.esAdmin());
	const [esInterno, setEsInterno] = useState(authService.esInterno());
	const [rolUsuario, setRolUsuario] = useState<string | null>(authService.obtenerRolActual());
	const [nombreCliente, setNombreCliente] = useState<string | null>(null);
	const [carritoCantidad, setCarritoCantidad] = useState(0);
	const [toastCarrito, setToastCarrito] = useState<string | null>(null);
	const [pedidoConfirmadoId, setPedidoConfirmadoId] = useState<number | null>(null);

	const recargarCarritoCantidad = async () => {
		if (!estaLogueado || !authService.esCliente()) {
			setCarritoCantidad(0);
			return;
		}
		try {
			const carrito = await carritoService.obtener();
			const cantidad = carrito.items.reduce((acc, item) => acc + item.cantidad, 0);
			setCarritoCantidad(cantidad);
		} catch {
			setCarritoCantidad(0);
		}
	};

	useEffect(() => {
		const cargarPerfil = async () => {
			if (!estaLogueado) {
				setNombreCliente(null);
				setEsAdmin(false);
				setEsInterno(false);
				setRolUsuario(null);
				return;
			}
			const rol = authService.obtenerRolActual();
			const admin = rol === "Admin";
			const interno = rol === "Admin" || rol === "Ventas" || rol === "Soporte";
			setRolUsuario(rol);
			setEsAdmin(admin);
			setEsInterno(interno);
			if (interno) {
				setNombreCliente(rol ?? "Interno");
				return;
			}
			try {
				const perfil = await clienteService.obtenerMiPerfil();
				const primerNombre = perfil.nombreCompleto?.trim().split(" ")[0] ?? null;
				setNombreCliente(primerNombre);
			} catch {
				authService.logout();
				setEstaLogueado(false);
				setNombreCliente(null);
				setEsAdmin(false);
				setEsInterno(false);
				setRolUsuario(null);
				navigate("/login", { replace: true });
			}
		};
		void cargarPerfil();
	}, [estaLogueado, navigate]);

	useEffect(() => {
		const handleUnauthorized = () => {
			setEstaLogueado(false);
			setEsAdmin(false);
			setEsInterno(false);
			setRolUsuario(null);
			setNombreCliente(null);
			navigate("/login", { replace: true });
		};
		window.addEventListener("auth:unauthorized", handleUnauthorized);
		return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
	}, [navigate]);

	useEffect(() => {
		void recargarCarritoCantidad();
	}, [estaLogueado, esInterno, location.pathname]);

	useEffect(() => {
		if (location.pathname.startsWith("/celulares/")) {
			window.scrollTo({ top: 0, left: 0, behavior: "auto" });
		}
	}, [location.pathname]);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const pago = params.get("pago");
		if (!pago) return;
		if (pago !== "exitoso" && pago !== "fallido" && pago !== "pendiente") return;
		if (location.pathname === "/resultado-pago") return;
		navigate(`/resultado-pago${location.search}`, { replace: true });
	}, [location.pathname, location.search, navigate]);

	const esVistaLogin = location.pathname === "/login";
	const enTienda =
		location.pathname === "/catalogo" ||
		location.pathname.startsWith("/celulares/") ||
		location.pathname.startsWith("/carrito") ||
		location.pathname.startsWith("/checkout");

	return (
		<div className="bg-gray-50 min-h-screen font-sans flex flex-col">
			{toastCarrito && (
				<div className="fixed right-6 top-20 z-50 rounded-md bg-[#001830] px-4 py-2 text-sm text-white shadow-lg">
					{toastCarrito}
				</div>
			)}

			{esVistaLogin ? (
				<NavbarLogin onIrAInicio={() => navigate("/")} />
			) : (
				<Navbar
					enTienda={enTienda}
					estaLogueado={estaLogueado}
					esAdmin={esAdmin}
					esInterno={esInterno}
					rolUsuario={rolUsuario}
					nombreCliente={nombreCliente}
					carritoCantidad={carritoCantidad}
					onIrATienda={() => navigate("/catalogo")}
					onIrAInicio={() => navigate("/")}
					onIrAContacto={() => navigate("/contacto")}
					onIrAPreguntasFrecuentes={() => navigate("/preguntas-frecuentes")}
					onIrAAdmin={() => navigate("/admin")}
					onIrALogin={() => navigate("/login")}
					onVerPerfil={() => navigate("/mi-perfil")}
					onVerMisPedidos={() => navigate("/mis-pedidos")}
					onCambiarClave={() => navigate("/cambiar-clave")}
					onIrACarrito={() => navigate(estaLogueado && authService.esCliente() ? "/carrito" : "/login")}
					onLogout={() => {
						authService.logout();
						setEstaLogueado(false);
						setEsAdmin(false);
						setEsInterno(false);
						setRolUsuario(null);
						navigate("/");
					}}
				/>
			)}

			<main className="flex flex-1 min-h-0 flex-col">
				<Routes>
					<Route path="/" element={<Landing onIrATienda={() => navigate("/catalogo")} onVerDetalle={(id) => navigate(`/celulares/${id}`)} />} />
					<Route path="/contacto" element={<Contacto />} />
					<Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
					<Route path="/catalogo" element={<Catalogo onVerDetalle={(id) => navigate(`/celulares/${id}`)} />} />
					<Route
						path="/celulares/:id"
						element={
							<DetalleCelularRoute
								onRequiereLogin={() => navigate("/login")}
								onAgregadoCarrito={async (mensaje) => {
									await recargarCarritoCantidad();
									setToastCarrito(mensaje);
									setTimeout(() => setToastCarrito(null), 1600);
								}}
							/>
						}
					/>
					<Route
						path="/login"
						element={
							<Login
								onLoginExitoso={() => {
									setEstaLogueado(true);
									const rol = authService.obtenerRolActual();
									const admin = rol === "Admin";
									const interno = rol === "Admin" || rol === "Ventas" || rol === "Soporte";
									setEsAdmin(admin);
									setEsInterno(interno);
									setRolUsuario(rol);
									navigate(interno ? "/admin" : "/");
								}}
							/>
						}
					/>
					<Route
						path="/carrito"
						element={
							!estaLogueado || !authService.esCliente() ? (
								<Navigate to="/login" replace />
							) : (
								<Carrito
									onCambioCarrito={recargarCarritoCantidad}
									onIrATienda={() => navigate("/catalogo")}
									onIrACheckout={(reserva: ReservaCheckout) =>
										navigate("/checkout", { state: { reservaSegundosRestantes: reserva.segundosRestantes } })
									}
								/>
							)
						}
					/>
					<Route
						path="/checkout"
						element={!estaLogueado || !authService.esCliente() ? <Navigate to="/login" replace /> : <CheckoutRoute onCompraConfirmada={(pedidoId) => {
							setPedidoConfirmadoId(pedidoId);
							void recargarCarritoCantidad();
							navigate("/compra-confirmada");
						}} onVolverCarrito={() => navigate("/carrito")} />}
					/>
					<Route path="/admin" element={esInterno ? <AdminPanel rol={rolUsuario} /> : <Navigate to="/login" replace />} />
					<Route path="/cambiar-clave" element={authService.esCliente() ? <CambiarClave onVolver={() => navigate("/")} /> : <Navigate to="/admin" replace />} />
					<Route path="/mi-perfil" element={authService.esCliente() ? <MiPerfil /> : <Navigate to="/admin" replace />} />
					<Route path="/mis-pedidos" element={authService.esCliente() ? <MisPedidos onVerDetalle={(pedidoId) => navigate(`/mis-pedidos/${pedidoId}`)} /> : <Navigate to="/admin" replace />} />
					<Route path="/mis-pedidos/:pedidoId" element={authService.esCliente() ? <DetallePedidoRoute onVolver={() => navigate("/mis-pedidos")} /> : <Navigate to="/admin" replace />} />
					<Route
						path="/compra-confirmada"
						element={<CompraConfirmada pedidoId={pedidoConfirmadoId} onVerMisPedidos={() => navigate("/mis-pedidos")} onIrATienda={() => navigate("/catalogo")} />}
					/>
					<Route
						path="/resultado-pago"
						element={<ResultadoPagoRoute onVerMisPedidos={() => navigate("/mis-pedidos")} onIrATienda={() => navigate("/catalogo")} />}
					/>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</main>
		</div>
	);
}

function DetalleCelularRoute({
	onRequiereLogin,
	onAgregadoCarrito,
}: {
	onRequiereLogin: () => void;
	onAgregadoCarrito: (mensaje: string) => void | Promise<void>;
}) {
	const { id } = useParams();
	const celularId = id ? Number(id) : NaN;
	if (!Number.isFinite(celularId)) return <Navigate to="/catalogo" replace />;
	return <DetalleCelular celularId={celularId} onRequiereLogin={onRequiereLogin} onAgregadoCarrito={onAgregadoCarrito} />;
}

function CheckoutRoute({
	onCompraConfirmada,
	onVolverCarrito,
}: {
	onCompraConfirmada: (pedidoId: number) => void;
	onVolverCarrito: () => void;
}) {
	const location = useLocation();
	const state = (location.state ?? {}) as CheckoutLocationState;
	if (!state.reservaSegundosRestantes || state.reservaSegundosRestantes <= 0) {
		return <Navigate to="/carrito" replace />;
	}
	return (
		<Checkout
			reservaSegundosIniciales={state.reservaSegundosRestantes}
			onVolverCarrito={onVolverCarrito}
			onCompraConfirmada={onCompraConfirmada}
		/>
	);
}

function DetallePedidoRoute({ onVolver }: { onVolver: () => void }) {
	const { pedidoId } = useParams();
	const id = pedidoId ? Number(pedidoId) : NaN;
	if (!Number.isFinite(id)) return <Navigate to="/mis-pedidos" replace />;
	return <DetallePedido pedidoId={id} onVolver={onVolver} />;
}

function ResultadoPagoRoute({ onVerMisPedidos, onIrATienda }: { onVerMisPedidos: () => void; onIrATienda: () => void }) {
	const [searchParams] = useSearchParams();
	const [detallePedido, setDetallePedido] = useState<DetallePedidoResponse | null>(null);
	const [estadoFinal, setEstadoFinal] = useState<"exitoso" | "fallido" | "pendiente" | null>(null);
	const pago = searchParams.get("pago");
	const estadoQuery = pago === "exitoso" || pago === "fallido" || pago === "pendiente" ? pago : "pendiente";

	useEffect(() => {
		const cargarDetalle = async () => {
			const externalReference = searchParams.get("external_reference");
			const pedidoGuardado = sessionStorage.getItem("ultimoPedidoCheckoutId");
			const pedidoId = Number(externalReference ?? pedidoGuardado);

			if (!Number.isFinite(pedidoId) || pedidoId <= 0) {
				setEstadoFinal(estadoQuery);
				return;
			}

			try {
				const maxIntentos = estadoQuery === "exitoso" ? 6 : 1;
				for (let intento = 1; intento <= maxIntentos; intento++) {
					const detalle = await pedidoService.obtenerDetalleMiPedido(pedidoId);
					setDetallePedido(detalle);

					const estadoPedido = detalle.estado?.trim().toLowerCase();
					if (estadoPedido === "pagado") {
						setEstadoFinal("exitoso");
						return;
					}
					if (estadoPedido === "cancelado") {
						setEstadoFinal("fallido");
						return;
					}

					const esUltimoIntento = intento === maxIntentos;
					if (estadoPedido === "pendiente de pago" && !esUltimoIntento && estadoQuery === "exitoso") {
						await new Promise((resolve) => setTimeout(resolve, 2000));
						continue;
					}

					if (estadoPedido === "pendiente de pago") {
						setEstadoFinal("pendiente");
						return;
					}

					setEstadoFinal(estadoQuery);
					return;
				}
			} catch {
				setDetallePedido(null);
				setEstadoFinal(estadoQuery);
			}
		};

		void cargarDetalle();
	}, [estadoQuery, searchParams]);

	return (
		<ResultadoPago
			estado={estadoFinal ?? estadoQuery}
			onVerMisPedidos={onVerMisPedidos}
			onIrATienda={onIrATienda}
			detallePedido={detallePedido}
		/>
	);
}

export default App;
