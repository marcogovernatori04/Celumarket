import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Landing } from "./pages/Landing";
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
import { NavbarLogin } from "./components/NavbarLogin";
import { clienteService } from "./services/clienteService";
import { carritoService } from "./services/carritoService";
import type { ReservaCheckout } from "./services/pedidoService";

function App() {
	const [vista, setVista] = useState<"landing" | "catalogo" | "detalle" | "login" | "carrito" | "checkout" | "cambiar-clave" | "mi-perfil" | "mis-pedidos" | "detalle-pedido" | "compra-confirmada" | "resultado-pago" | "admin">("landing");
	const [celularSeleccionadoId, setCelularSeleccionadoId] = useState<number | null>(null);
	const [estaLogueado, setEstaLogueado] = useState(authService.estaLogueado());
	const [esAdmin, setEsAdmin] = useState(authService.esAdmin());
	const [nombreCliente, setNombreCliente] = useState<string | null>(null);
	const [carritoCantidad, setCarritoCantidad] = useState(0);
	const [toastCarrito, setToastCarrito] = useState<string | null>(null);
	const [checkoutConReserva, setCheckoutConReserva] = useState(false);
	const [checkoutReservaSegundosRestantes, setCheckoutReservaSegundosRestantes] = useState<number>(0);
	const [pedidoConfirmadoId, setPedidoConfirmadoId] = useState<number | null>(null);
	const [pedidoDetalleId, setPedidoDetalleId] = useState<number | null>(null);
	const [estadoPagoRedirect, setEstadoPagoRedirect] = useState<"exitoso" | "fallido" | "pendiente">("pendiente");

	const irADetalle = (celularId: number) => {
		setCelularSeleccionadoId(celularId);
		setVista("detalle");
	};

	const recargarCarritoCantidad = async () => {
		if (!estaLogueado) {
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
				return;
			}
			setEsAdmin(authService.esAdmin());
			if (authService.esAdmin()) {
				setNombreCliente("Admin");
				return;
			}
			try {
				const perfil = await clienteService.obtenerMiPerfil();
				const primerNombre = perfil.nombreCompleto?.trim().split(" ")[0] ?? null;
				setNombreCliente(primerNombre);
			} catch {
				if (!authService.esAdmin()) {
					authService.logout();
					setEstaLogueado(false);
					setNombreCliente(null);
					setEsAdmin(false);
				}
			}
		};
		void cargarPerfil();
	}, [estaLogueado]);

	useEffect(() => {
		const handleUnauthorized = () => {
			setEstaLogueado(false);
			setEsAdmin(false);
			setNombreCliente(null);
			setVista("login");
		};
		window.addEventListener("auth:unauthorized", handleUnauthorized);
		return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
	}, []);

	useEffect(() => {
		void recargarCarritoCantidad();
	}, [estaLogueado, vista]);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const pago = params.get("pago");
		if (pago === "exitoso" || pago === "fallido" || pago === "pendiente") {
			setEstadoPagoRedirect(pago);
			setVista("resultado-pago");
			const nuevaUrl = `${window.location.pathname}${window.location.hash || ""}`;
			window.history.replaceState({}, "", nuevaUrl);
		}
	}, []);

	useEffect(() => {
		if (vista === "detalle") {
			window.scrollTo({ top: 0, left: 0, behavior: "auto" });
		}
	}, [vista, celularSeleccionadoId]);

	return (
		<div className="bg-gray-50 min-h-screen font-sans flex flex-col">
			{toastCarrito && (
				<div className="fixed right-6 top-20 z-50 rounded-md bg-[#001830] px-4 py-2 text-sm text-white shadow-lg">
					{toastCarrito}
				</div>
			)}
			{vista === "login" ? (
				<NavbarLogin onIrAInicio={() => setVista("landing")} />
			) : (
				<Navbar
					enTienda={vista === "catalogo" || vista === "detalle" || vista === "carrito" || vista === "checkout"}
					estaLogueado={estaLogueado}
					esAdmin={esAdmin}
					nombreCliente={nombreCliente}
					carritoCantidad={carritoCantidad}
					onIrATienda={() => setVista("catalogo")}
					onIrAInicio={() => setVista("landing")}
					onIrAAdmin={() => setVista("admin")}
					onIrALogin={() => setVista("login")}
					onVerPerfil={() => setVista("mi-perfil")}
					onVerMisPedidos={() => setVista("mis-pedidos")}
					onCambiarClave={() => setVista("cambiar-clave")}
					onIrACarrito={() => setVista(estaLogueado && !esAdmin ? "carrito" : "login")}
					onLogout={() => {
						authService.logout();
						setEstaLogueado(false);
						setEsAdmin(false);
						setVista("landing");
					}}
				/>
			)}

			<main className="flex flex-1 min-h-0 flex-col">
				{vista === "landing" && <Landing onIrATienda={() => setVista("catalogo")} onVerDetalle={irADetalle} />}
				{vista === "catalogo" && <Catalogo onVerDetalle={irADetalle} />}
				{vista === "detalle" && celularSeleccionadoId !== null && (
					<DetalleCelular
						celularId={celularSeleccionadoId}
						onRequiereLogin={() => setVista("login")}
						onAgregadoCarrito={async (mensaje) => {
							await recargarCarritoCantidad();
							setToastCarrito(mensaje);
							setTimeout(() => setToastCarrito(null), 1600);
						}}
					/>
				)}
				{vista === "login" && (
					<Login
						onLoginExitoso={() => {
							setEstaLogueado(true);
							const admin = authService.esAdmin();
							setEsAdmin(admin);
							setVista(admin ? "admin" : "carrito");
						}}
					/>
				)}
				{vista === "carrito" && !esAdmin && (
					<Carrito
						onCambioCarrito={recargarCarritoCantidad}
						onIrATienda={() => setVista("catalogo")}
						onIrACheckout={(reserva: ReservaCheckout) => {
							setCheckoutReservaSegundosRestantes(reserva.segundosRestantes);
							setCheckoutConReserva(true);
							setVista("checkout");
						}}
					/>
				)}
				{vista === "checkout" && checkoutConReserva && !esAdmin && (
					<Checkout
						reservaSegundosIniciales={checkoutReservaSegundosRestantes}
						onVolverCarrito={() => setVista("carrito")}
						onCompraConfirmada={(pedidoId) => {
							setPedidoConfirmadoId(pedidoId);
							setCheckoutConReserva(false);
							void recargarCarritoCantidad();
							setVista("compra-confirmada");
						}}
					/>
				)}
				{vista === "admin" && esAdmin && <AdminPanel />}
				{vista === "cambiar-clave" && <CambiarClave onVolver={() => setVista("landing")} />}
				{vista === "mi-perfil" && <MiPerfil />}
				{vista === "mis-pedidos" && <MisPedidos onVerDetalle={(pedidoId) => { setPedidoDetalleId(pedidoId); setVista("detalle-pedido"); }} />}
				{vista === "detalle-pedido" && pedidoDetalleId !== null && <DetallePedido pedidoId={pedidoDetalleId} onVolver={() => setVista("mis-pedidos")} />}
				{vista === "compra-confirmada" && (
					<CompraConfirmada
						pedidoId={pedidoConfirmadoId}
						onVerMisPedidos={() => setVista("mis-pedidos")}
						onIrATienda={() => setVista("catalogo")}
					/>
				)}
				{vista === "resultado-pago" && (
					<ResultadoPago
						estado={estadoPagoRedirect}
						onVerMisPedidos={() => setVista("mis-pedidos")}
						onIrATienda={() => setVista("catalogo")}
					/>
				)}
			</main>
		</div>
	);
}

export default App;
