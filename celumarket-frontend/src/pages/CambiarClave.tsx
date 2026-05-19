import { useState } from "react";
import { passwordService } from "../services/passwordService";
import { twAuth } from "../styles/tw";

type CambiarClaveProps = {
	onVolver: () => void;
};

export const CambiarClave = ({ onVolver }: CambiarClaveProps) => {
	const [claveActual, setClaveActual] = useState("");
	const [claveNueva, setClaveNueva] = useState("");
	const [mensaje, setMensaje] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const guardar = async (e: React.FormEvent) => {
		e.preventDefault();
		setMensaje(null);
		setError(null);
		try {
			await passwordService.cambiarClave(claveActual, claveNueva);
			setMensaje("Clave actualizada con éxito.");
			setClaveActual("");
			setClaveNueva("");
		} catch {
			setError("No se pudo cambiar la clave. Verificá la clave actual.");
		}
	};

	return (
		<div className={twAuth.authBg}>
			<div className="mx-auto flex w-full max-w-[1440px] justify-center px-4 pt-16">
				<form onSubmit={guardar} className={`w-full max-w-[477px] ${twAuth.authCard}`}>
					<h2 className="mb-5 text-2xl font-semibold text-[#001830]">Cambiar clave</h2>
					<input value={claveActual} onChange={(e) => setClaveActual(e.target.value)} type="password" placeholder="Clave actual" className={`mb-3 ${twAuth.authInput}`} required />
					<input value={claveNueva} onChange={(e) => setClaveNueva(e.target.value)} type="password" placeholder="Nueva clave (mín. 8)" className={`mb-3 ${twAuth.authInput}`} required />
					{mensaje && <p className="mb-3 text-sm text-green-700">{mensaje}</p>}
					{error && <p className="mb-3 text-sm text-red-600">{error}</p>}
					<div className="flex gap-2">
						<button className={`${twAuth.authPrimaryBtn} h-11 flex-1`}>Guardar</button>
						<button type="button" onClick={onVolver} className="h-11 flex-1 rounded-md border border-gray-300 bg-white text-[#1e1e1e]">Volver</button>
					</div>
				</form>
			</div>
		</div>
	);
};
