import { useState } from "react";
import { authService } from "../services/authService";
import { passwordService } from "../services/passwordService";
import { twAuth } from "../styles/tw";

type LoginProps = {
	onLoginExitoso: () => void;
};

export const Login = ({ onLoginExitoso }: LoginProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [modoRecuperar, setModoRecuperar] = useState(false);
	const [tokenRecuperacion, setTokenRecuperacion] = useState("");
	const [nuevaClave, setNuevaClave] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [cargando, setCargando] = useState(false);

	const enviar = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setCargando(true);
		try {
			await authService.login({ email, password });
			onLoginExitoso();
		} catch {
			setError("Credenciales inválidas o servidor no disponible.");
		} finally {
			setCargando(false);
		}
	};

	const solicitarRecuperacion = async () => {
		setError(null);
		setCargando(true);
		try {
			const token = await passwordService.solicitarRecuperacion(email);
			setTokenRecuperacion(token ?? "");
		} catch {
			setError("No se pudo solicitar recuperación.");
		} finally {
			setCargando(false);
		}
	};

	const confirmarRecuperacion = async () => {
		setError(null);
		setCargando(true);
		try {
			await passwordService.confirmarRecuperacion(tokenRecuperacion, nuevaClave);
			setModoRecuperar(false);
			setTokenRecuperacion("");
			setNuevaClave("");
		} catch {
			setError("No se pudo restablecer la clave.");
		} finally {
			setCargando(false);
		}
	};

	return (
		<div className={twAuth.authBg}>
			<div className="mx-auto flex w-full max-w-[1440px] justify-center px-4 pt-16">
				<div className="w-full max-w-[477px]">
					<form onSubmit={enviar} className={twAuth.authCard}>
						<div className="mb-5">
							<label className="mb-2 block text-base text-[#1e1e1e]">Email</label>
							<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={twAuth.authInput} required />
						</div>
						{!modoRecuperar ? (
							<>
								<div className="mb-5">
									<label className="mb-2 block text-base text-[#1e1e1e]">Contraseña</label>
									<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className={twAuth.authInput} required />
								</div>
								<button disabled={cargando} className={`${twAuth.authPrimaryBtn} text-xl font-medium leading-none`}>
									{cargando ? "Iniciando..." : "Iniciar sesión"}
								</button>
								<div className="mt-5">
									<button type="button" onClick={() => setModoRecuperar(true)} className="text-base text-[#001524] underline">
										Olvidé mi contraseña
									</button>
								</div>
							</>
						) : (
							<>
								<div className="mb-3">
									<button type="button" onClick={solicitarRecuperacion} className={`${twAuth.authPrimaryBtn} h-10`}>
										Solicitar token de recuperación
									</button>
								</div>
								<input value={tokenRecuperacion} onChange={(e) => setTokenRecuperacion(e.target.value)} placeholder="Token de recuperación" className={`mb-3 ${twAuth.authInput}`} />
								<input value={nuevaClave} onChange={(e) => setNuevaClave(e.target.value)} type="password" placeholder="Nueva clave (mín. 8)" className={`mb-3 ${twAuth.authInput}`} />
								<button type="button" onClick={confirmarRecuperacion} className={`${twAuth.authPrimaryBtn} h-10`}>
									Restablecer clave
								</button>
								<div className="mt-4">
									<button type="button" onClick={() => setModoRecuperar(false)} className="text-base text-[#001524] underline">
										Volver al login
									</button>
								</div>
							</>
						)}
						{error && <p className="mt-3 text-sm text-red-600">{error}</p>}
					</form>

					<button type="button" className={`mt-5 ${twAuth.authSecondaryBtn}`}>
						Continuar con Google
					</button>
				</div>
			</div>
		</div>
	);
};
