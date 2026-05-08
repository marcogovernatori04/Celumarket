import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Landing } from "./pages/Landing";
import { Catalogo } from "./pages/Catalogo";
import { DetalleCelular } from "./pages/DetalleCelular";
import { Login } from "./pages/Login";
import { Carrito } from "./pages/Carrito";
import { CambiarClave } from "./pages/CambiarClave";
import { MiPerfil } from "./pages/MiPerfil";
import { authService } from "./services/authService";
import { NavbarLogin } from "./components/NavbarLogin";
import { clienteService } from "./services/clienteService";
import { carritoService } from "./services/carritoService";

function App() {
	const [vista, setVista] = useState<"landing" | "catalogo" | "detalle" | "login" | "carrito" | "cambiar-clave" | "mi-perfil">("landing");
	const [celularSeleccionadoId, setCelularSeleccionadoId] = useState<number | null>(null);
	const [estaLogueado, setEstaLogueado] = useState(authService.estaLogueado());
	const [nombreCliente, setNombreCliente] = useState<string | null>(null);
	const [direccionCliente, setDireccionCliente] = useState<string | null>(null);
	const [codigoPostalDireccionCliente, setCodigoPostalDireccionCliente] = useState<number | null>(null);
	const [carritoCantidad, setCarritoCantidad] = useState(0);
	const [toastCarrito, setToastCarrito] = useState<string | null>(null);

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
				setDireccionCliente(null);
				setCodigoPostalDireccionCliente(null);
				return;
			}
			try {
				const perfil = await clienteService.obtenerMiPerfil();
				const primerNombre = perfil.nombreCompleto?.trim().split(" ")[0] ?? null;
				setNombreCliente(primerNombre);
				setDireccionCliente(perfil.direccionCompleta ?? null);
				setCodigoPostalDireccionCliente(perfil.codigoPostalDireccion ?? null);
			} catch {
				setNombreCliente(null);
				setDireccionCliente(null);
				setCodigoPostalDireccionCliente(null);
			}
		};
		void cargarPerfil();
	}, [estaLogueado]);

	useEffect(() => {
		void recargarCarritoCantidad();
	}, [estaLogueado, vista]);

	return (
		<div className="bg-gray-50 min-h-screen font-sans">
			{toastCarrito && (
				<div className="fixed right-6 top-20 z-50 rounded-md bg-[#001830] px-4 py-2 text-sm text-white shadow-lg">
					{toastCarrito}
				</div>
			)}
			{vista === "login" ? (
				<NavbarLogin onIrAInicio={() => setVista("landing")} />
			) : (
				<Navbar
					enTienda={vista === "catalogo" || vista === "detalle" || vista === "carrito"}
					estaLogueado={estaLogueado}
					nombreCliente={nombreCliente}
					carritoCantidad={carritoCantidad}
					onIrATienda={() => setVista("catalogo")}
					onIrAInicio={() => setVista("landing")}
					onIrALogin={() => setVista("login")}
					onVerPerfil={() => setVista("mi-perfil")}
					onCambiarClave={() => setVista("cambiar-clave")}
					onIrACarrito={() => setVista(estaLogueado ? "carrito" : "login")}
					onLogout={() => {
						authService.logout();
						setEstaLogueado(false);
						setVista("landing");
					}}
				/>
			)}

			<main className="flex-grow">
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
							setVista("carrito");
						}}
					/>
				)}
				{vista === "carrito" && (
					<Carrito
						onCambioCarrito={recargarCarritoCantidad}
						direccionCliente={direccionCliente}
						codigoPostalDireccionCliente={codigoPostalDireccionCliente}
					/>
				)}
				{vista === "cambiar-clave" && <CambiarClave onVolver={() => setVista("landing")} />}
				{vista === "mi-perfil" && <MiPerfil />}
			</main>
		</div>
	);
}

export default App;
