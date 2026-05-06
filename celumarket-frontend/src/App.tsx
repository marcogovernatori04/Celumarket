import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Landing } from "./pages/Landing";
import { Catalogo } from "./pages/Catalogo";

function App() {
	const [vista, setVista] = useState<"landing" | "catalogo">("landing");

	return (
		<div className="bg-gray-50 min-h-screen font-sans">
			<Navbar enTienda={vista === "catalogo"} onIrATienda={() => setVista("catalogo")} onIrAInicio={() => setVista("landing")} />

			<main className="flex-grow">
				{vista === "landing" ? <Landing onIrATienda={() => setVista("catalogo")} /> : <Catalogo />}
			</main>
		</div>
	);
}

export default App;
