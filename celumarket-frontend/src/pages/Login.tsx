import { useState } from "react";
import { authService } from "../services/authService";
import { passwordService } from "../services/passwordService";
import { clienteService } from "../services/clienteService";
import { twAuth } from "../styles/tw";
import { isAxiosError } from "axios";
import { esEnteroPositivo, esTextoUbicacionValido } from "../utils/validation";

type LoginProps = {
	onLoginExitoso: () => void;
};

export const Login = ({ onLoginExitoso }: LoginProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [modoRegistro, setModoRegistro] = useState(false);
	const [modoRecuperar, setModoRecuperar] = useState(false);
	const [dni, setDni] = useState("");
	const [nombre, setNombre] = useState("");
	const [apellido, setApellido] = useState("");
	const [telefono, setTelefono] = useState("");
	const [calle, setCalle] = useState("");
	const [numero, setNumero] = useState("");
	const [pisoDepto, setPisoDepto] = useState("");
	const [localidad, setLocalidad] = useState("");
	const [provincia, setProvincia] = useState("");
	const [codigoPostal, setCodigoPostal] = useState("");
	const [tokenRecuperacion, setTokenRecuperacion] = useState("");
	const [nuevaClave, setNuevaClave] = useState("");
	const [confirmarNuevaClave, setConfirmarNuevaClave] = useState("");
	const [tokenSolicitado, setTokenSolicitado] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [cargando, setCargando] = useState(false);

	const obtenerMensajeError = (err: unknown, fallback: string) => {
		if (!isAxiosError(err)) return fallback;
		if (err.response?.status === 401) return "Email o contraseña incorrectos.";

		const data = err.response?.data as { error?: string; mensaje?: string; Mensaje?: string } | undefined;
		return data?.error || data?.mensaje || data?.Mensaje || fallback;
	};

	const enviar = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setCargando(true);
		try {
			await authService.login({ email, password });
			onLoginExitoso();
		} catch (err) {
			setError(obtenerMensajeError(err, "Credenciales inválidas o servidor no disponible."));
		} finally {
			setCargando(false);
		}
	};

	const registrar = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		if (password.trim().length < 8) {
			setError("La contraseña debe tener al menos 8 caracteres.");
			return;
		}

		if (!esEnteroPositivo(numero)) {
			setError("El número de dirección debe ser un número válido.");
			return;
		}

		if (!esTextoUbicacionValido(localidad)) {
			setError("La localidad no debe contener números.");
			return;
		}

		if (!esTextoUbicacionValido(provincia)) {
			setError("La provincia no debe contener números.");
			return;
		}

		const cp = Number(codigoPostal);
		if (!esEnteroPositivo(codigoPostal)) {
			setError("El código postal debe ser un número válido.");
			return;
		}

		setCargando(true);
		try {
			await clienteService.registrar({
				dni,
				nombre,
				apellido,
				email,
				telefono,
				calle,
				numero,
				pisoDepto,
				localidad,
				provincia,
				codigoPostal: cp,
				password,
			});
			await authService.login({ email, password });
			onLoginExitoso();
		} catch (err) {
			setError(obtenerMensajeError(err, "No se pudo registrar la cuenta. Verifica los datos."));
		} finally {
			setCargando(false);
		}
	};

	const solicitarRecuperacion = async () => {
		setError(null);
		setCargando(true);
		try {
			await passwordService.solicitarRecuperacion(email);
			setTokenSolicitado(true);
		} catch (err) {
			setError(obtenerMensajeError(err, "No se pudo solicitar recuperación."));
		} finally {
			setCargando(false);
		}
	};

	const confirmarRecuperacion = async () => {
		setError(null);
		if (nuevaClave.trim().length < 8) {
			setError("La nueva clave debe tener al menos 8 caracteres.");
			return;
		}
		if (nuevaClave !== confirmarNuevaClave) {
			setError("Las claves nuevas no coinciden.");
			return;
		}
		setCargando(true);
		try {
			await passwordService.confirmarRecuperacion(tokenRecuperacion, nuevaClave);
			setModoRecuperar(false);
			setTokenSolicitado(false);
			setTokenRecuperacion("");
			setNuevaClave("");
			setConfirmarNuevaClave("");
		} catch (err) {
			setError(obtenerMensajeError(err, "No se pudo restablecer la clave."));
		} finally {
			setCargando(false);
		}
	};

	return (
		<div className={twAuth.authBg}>
			<div className="mx-auto flex w-full max-w-[1440px] justify-center px-4 py-10 sm:pt-16">
				<div className="w-full max-w-[477px]">
					<form onSubmit={modoRegistro ? registrar : enviar} className={twAuth.authCard}>
						<div className="mb-5">
							<label className="mb-2 block text-base text-[#1e1e1e]">Email</label>
							<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={twAuth.authInput} required />
						</div>
						{!modoRecuperar && modoRegistro ? (
							<>
								<div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
									<input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className={twAuth.authInput} required />
									<input value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" className={twAuth.authInput} required />
								</div>
								<div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
									<input value={dni} onChange={(e) => setDni(e.target.value)} placeholder="DNI" className={twAuth.authInput} required />
									<input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" className={twAuth.authInput} required />
								</div>
								<div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
									<input value={calle} onChange={(e) => setCalle(e.target.value)} placeholder="Calle" className={twAuth.authInput} required />
									<input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Número" className={twAuth.authInput} inputMode="numeric" required />
								</div>
								<div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
									<input value={pisoDepto} onChange={(e) => setPisoDepto(e.target.value)} placeholder="Piso/Depto (opcional)" className={twAuth.authInput} />
									<input value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} placeholder="Código postal" className={twAuth.authInput} inputMode="numeric" required />
								</div>
								<div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
									<input value={localidad} onChange={(e) => setLocalidad(e.target.value)} placeholder="Localidad" className={twAuth.authInput} required />
									<input value={provincia} onChange={(e) => setProvincia(e.target.value)} placeholder="Provincia" className={twAuth.authInput} required />
								</div>
								<div className="mb-5">
									<label className="mb-2 block text-base text-[#1e1e1e]">Contraseña</label>
									<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className={twAuth.authInput} required />
								</div>
								<button disabled={cargando} className={`${twAuth.authPrimaryBtn} text-xl font-medium leading-none`}>
									{cargando ? "Creando..." : "Crear cuenta"}
								</button>
								<div className="mt-4">
									<button type="button" onClick={() => setModoRegistro(false)} className="text-base text-[#001524] underline">
										Ya tengo cuenta
									</button>
								</div>
							</>
						) : !modoRecuperar ? (
							<>
								<div className="mb-5">
									<label className="mb-2 block text-base text-[#1e1e1e]">Contraseña</label>
									<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className={twAuth.authInput} required />
								</div>
								{error && <p className="mb-3 text-sm font-semibold text-red-600">{error}</p>}
								<button disabled={cargando} className={`${twAuth.authPrimaryBtn} text-xl font-medium leading-none`}>
									{cargando ? "Iniciando..." : "Iniciar sesión"}
								</button>
								<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<button
										type="button"
										onClick={() => {
											setModoRecuperar(true);
											setError(null);
											setTokenSolicitado(false);
											setTokenRecuperacion("");
											setNuevaClave("");
											setConfirmarNuevaClave("");
										}}
										className="text-base text-[#001524] underline"
									>
										Olvidé mi contraseña
									</button>
									<button type="button" onClick={() => setModoRegistro(true)} className="text-base text-[#001524] underline">
										Crear cuenta
									</button>
								</div>
							</>
						) : (
							<>
								<div className="mb-3">
									<button type="button" onClick={solicitarRecuperacion} disabled={cargando} className={`${twAuth.authPrimaryBtn} h-10`}>
										{cargando ? "Enviando..." : "Enviar token por email"}
									</button>
								</div>
								{tokenSolicitado && (
									<p className="mb-3 text-sm text-[#334155]">
										Si el email existe, te enviamos un token de recuperación.
									</p>
								)}
								{tokenSolicitado && (
									<>
										<input value={tokenRecuperacion} onChange={(e) => setTokenRecuperacion(e.target.value)} placeholder="Token de recuperación" className={`mb-3 ${twAuth.authInput}`} />
										<input value={nuevaClave} onChange={(e) => setNuevaClave(e.target.value)} type="password" placeholder="Nueva clave (mín. 8)" className={`mb-3 ${twAuth.authInput}`} />
										<input value={confirmarNuevaClave} onChange={(e) => setConfirmarNuevaClave(e.target.value)} type="password" placeholder="Confirmar nueva clave" className={`mb-3 ${twAuth.authInput}`} />
										<button type="button" disabled={cargando} onClick={confirmarRecuperacion} className={`${twAuth.authPrimaryBtn} h-10`}>
											{cargando ? "Restableciendo..." : "Restablecer clave"}
										</button>
									</>
								)}
								<div className="mt-4">
									<button
										type="button"
										onClick={() => {
											setModoRecuperar(false);
											setError(null);
											setTokenSolicitado(false);
											setTokenRecuperacion("");
											setNuevaClave("");
											setConfirmarNuevaClave("");
										}}
										className="text-base text-[#001524] underline"
									>
										Volver al login
									</button>
								</div>
							</>
						)}
						{error && (modoRegistro || modoRecuperar) && <p className="mt-3 text-sm text-red-600">{error}</p>}
					</form>
				</div>
			</div>
		</div>
	);
};
