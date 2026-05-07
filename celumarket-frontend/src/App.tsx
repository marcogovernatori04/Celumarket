import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Landing } from "./pages/Landing";
import { Catalogo } from "./pages/Catalogo";
import { DetalleCelular } from "./pages/DetalleCelular";

function App() {
	const [vista, setVista] = useState<"landing" | "catalogo" | "detalle">("landing");
	const [celularSeleccionadoId, setCelularSeleccionadoId] = useState<number | null>(null);

	const irADetalle = (celularId: number) => {
		setCelularSeleccionadoId(celularId);
		setVista("detalle");
	};

	return (
		<div className="bg-gray-50 min-h-screen font-sans">
			<Navbar enTienda={vista === "catalogo" || vista === "detalle"} onIrATienda={() => setVista("catalogo")} onIrAInicio={() => setVista("landing")} />

			<main className="flex-grow">
				{vista === "landing" && <Landing onIrATienda={() => setVista("catalogo")} onVerDetalle={irADetalle} />}
				{vista === "catalogo" && <Catalogo onVerDetalle={irADetalle} />}
				{vista === "detalle" && celularSeleccionadoId !== null && <DetalleCelular celularId={celularSeleccionadoId} />}
			</main>
		</div>
	);
}

export default App;
