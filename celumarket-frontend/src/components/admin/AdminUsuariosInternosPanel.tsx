import { useEffect, useState } from "react";
import axios from "axios";
import {
	clienteService,
	type UsuarioInternoListado,
	type RegistrarUsuarioInternoPayload,
	type RolUsuarioInterno,
} from "../../services/clienteService";
import { twAdmin, twBase } from "../../styles/tw";

type NuevoUsuarioInterno = RegistrarUsuarioInternoPayload;

const estadoInicial: NuevoUsuarioInterno = {
	email: "",
	password: "",
	rol: "Ventas",
};

const obtenerMensajeApi = (err: unknown, fallback: string): string => {
	if (!axios.isAxiosError(err)) return fallback;
	const data = err.response?.data as
		| { error?: string; mensaje?: string; message?: string; Message?: string }
		| string
		| undefined;
	if (typeof data === "string" && data.trim().length > 0) return data;
	const msg =
		(typeof data === "object" && data?.error) ||
		(typeof data === "object" && data?.mensaje) ||
		(typeof data === "object" && data?.message) ||
		(typeof data === "object" && data?.Message);
	if (msg) return msg;
	const status = err.response?.status;
	return status ? `${fallback} (HTTP ${status})` : fallback;
};

export const AdminUsuariosInternosPanel = () => {
	const [usuarios, setUsuarios] = useState<UsuarioInternoListado[]>([]);
	const [nuevoUsuario, setNuevoUsuario] = useState<NuevoUsuarioInterno>(estadoInicial);
	const [cargando, setCargando] = useState(true);
	const [creando, setCreando] = useState(false);
	const [actualizandoRolId, setActualizandoRolId] = useState<number | null>(null);
	const [eliminandoUsuarioId, setEliminandoUsuarioId] = useState<number | null>(null);
	const [usuarioAEliminar, setUsuarioAEliminar] = useState<UsuarioInternoListado | null>(null);
	const [feedbackRol, setFeedbackRol] = useState<{
		tipo: "ok" | "error";
		mensaje: string;
	} | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [ok, setOk] = useState<string | null>(null);
	const [busqueda, setBusqueda] = useState("");

	const cargarUsuarios = async () => {
		setCargando(true);
		setError(null);
		try {
			const data = await clienteService.obtenerUsuariosInternos();
			setUsuarios(data);
		} catch {
			setError("No se pudo cargar la lista de usuarios internos.");
		} finally {
			setCargando(false);
		}
	};

	const actualizarRol = async (usuario: UsuarioInternoListado, rol: RolUsuarioInterno) => {
		if (usuario.rol === rol) return;
		setActualizandoRolId(usuario.id);
		setFeedbackRol(null);
		try {
			await clienteService.actualizarRolUsuarioInterno(usuario.id, rol);
			setUsuarios((prev) =>
				prev.map((item) => (item.id === usuario.id ? { ...item, rol } : item)),
			);
			setFeedbackRol({
				tipo: "ok",
				mensaje: "Rol actualizado.",
			});
		} catch (err) {
			setFeedbackRol({
				tipo: "error",
				mensaje: obtenerMensajeApi(err, "No se pudo actualizar el rol."),
			});
		} finally {
			setActualizandoRolId(null);
		}
	};

	useEffect(() => {
		void cargarUsuarios();
	}, []);

	const crearUsuario = async () => {
		const email = nuevoUsuario.email.trim();
		if (!email) {
			setError("Ingresá un email.");
			setOk(null);
			return;
		}
		if (nuevoUsuario.password.length < 8) {
			setError("La clave debe tener al menos 8 caracteres.");
			setOk(null);
			return;
		}

		setCreando(true);
		setError(null);
		setOk(null);
		setFeedbackRol(null);
		try {
			await clienteService.registrarUsuarioInterno({
				email,
				password: nuevoUsuario.password,
				rol: nuevoUsuario.rol,
			});
			setNuevoUsuario(estadoInicial);
			setOk(`Usuario ${nuevoUsuario.rol} creado.`);
			await cargarUsuarios();
		} catch (err) {
			setError(obtenerMensajeApi(err, "No se pudo crear el usuario interno."));
		} finally {
			setCreando(false);
		}
	};

	const eliminarUsuario = async () => {
		if (!usuarioAEliminar) return;
		setEliminandoUsuarioId(usuarioAEliminar.id);
		setError(null);
		setOk(null);
		setFeedbackRol(null);
		try {
			await clienteService.eliminarUsuarioInterno(usuarioAEliminar.id);
			setUsuarios((prev) => prev.filter((usuario) => usuario.id !== usuarioAEliminar.id));
			setOk("Usuario interno eliminado.");
			setUsuarioAEliminar(null);
		} catch (err) {
			setError(obtenerMensajeApi(err, "No se pudo eliminar el usuario interno."));
		} finally {
			setEliminandoUsuarioId(null);
		}
	};

	const termino = busqueda.trim().toLowerCase();
	const usuariosFiltrados = usuarios.filter((usuario) => {
		if (!termino) return true;
		return `${usuario.email} ${usuario.rol}`.toLowerCase().includes(termino);
	});

	return (
		<div className="min-w-0">
			<h2 className={twAdmin.adminSectionTitle}>Usuarios internos</h2>
			<p className={twAdmin.adminSectionSubtitle}>
				Alta y consulta de usuarios operativos del panel. Total: {usuariosFiltrados.length}
			</p>

			<div className={`mt-4 ${twAdmin.adminCard}`}>
				<p className="text-base font-semibold text-[#001830]">Crear usuario interno</p>
				<p className="text-sm text-[#64748b]">Roles disponibles para alta: ventas o soporte.</p>

				<div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1.3fr)_minmax(160px,0.7fr)_150px_auto] md:items-end">
					<label className="flex min-w-0 flex-col gap-1 text-sm text-[#334155]">
						Email
						<input
							type="text"
							inputMode="email"
							name="internal_user_email"
							autoComplete="off"
							autoCorrect="off"
							autoCapitalize="none"
							value={nuevoUsuario.email}
							onChange={(e) => setNuevoUsuario((prev) => ({ ...prev, email: e.target.value }))}
							placeholder="usuario@celumarket.com"
							className={`${twAdmin.adminInput} w-full`}
						/>
					</label>
					<label className="flex min-w-0 flex-col gap-1 text-sm text-[#334155]">
						Clave inicial
						<input
							type="password"
							name="internal_user_initial_password"
							autoComplete="new-password"
							value={nuevoUsuario.password}
							onChange={(e) => setNuevoUsuario((prev) => ({ ...prev, password: e.target.value }))}
							placeholder="Mínimo 8 caracteres"
							className={`${twAdmin.adminInput} w-full`}
						/>
					</label>
					<label className="flex min-w-0 flex-col gap-1 text-sm text-[#334155]">
						Rol
						<select
							name="internal_user_role"
							autoComplete="off"
							value={nuevoUsuario.rol}
							onChange={(e) => setNuevoUsuario((prev) => ({ ...prev, rol: e.target.value as NuevoUsuarioInterno["rol"] }))}
							className={`${twAdmin.adminInput} w-full bg-white`}
						>
							<option value="Ventas">Ventas</option>
							<option value="Soporte">Soporte</option>
						</select>
					</label>
					<button
						type="button"
						onClick={() => void crearUsuario()}
						disabled={creando}
						className="h-9 rounded-md bg-[#015cb9] px-4 text-sm font-semibold text-white hover:bg-[#017AF4] disabled:opacity-60"
					>
						{creando ? "Creando..." : "Crear"}
					</button>
				</div>
				{ok && <p className="mt-2 text-sm text-[#1E8E5A]">{ok}</p>}
				{error && <p className="mt-2 text-sm text-[#b91c1c]">{error}</p>}
			</div>

			<div className="mt-4">
				<input
					value={busqueda}
					onChange={(e) => setBusqueda(e.target.value)}
					placeholder="Buscar por email o rol..."
					className={`${twBase.searchInput} w-full max-w-[420px]`}
				/>
			</div>

			{cargando ? (
				<div className={`${twAdmin.adminMobileEmptyCard} mt-4`}>
					Cargando usuarios internos...
				</div>
			) : (
				<>
					<div className="mt-4 grid grid-cols-1 gap-3 lg:hidden">
						{usuariosFiltrados.length === 0 ? (
							<div className={twAdmin.adminMobileEmptyCard}>
								No hay usuarios internos para el filtro seleccionado.
							</div>
						) : (
							usuariosFiltrados.map((usuario) => (
								<div key={usuario.id} className={twAdmin.adminMobileCard}>
									<p className="break-words text-base font-semibold text-[#001830]">{usuario.email}</p>
									<div className="mt-2 flex flex-wrap items-center gap-2">
										<RolControl
											usuario={usuario}
											disabled={actualizandoRolId === usuario.id}
											onChange={(rol) => void actualizarRol(usuario, rol)}
										/>
										{usuario.rol !== "Admin" && (
											<button
												type="button"
												onClick={() => setUsuarioAEliminar(usuario)}
												className={twBase.actionBtnDanger}
											>
												Eliminar
											</button>
										)}
									</div>
								</div>
							))
						)}
					</div>

					<div className="mt-6 hidden overflow-auto rounded-xl border border-black/10 lg:block">
						<div className="min-w-[560px]">
							<div className={`grid grid-cols-[1fr_220px_120px] items-center px-4 py-3 ${twBase.tableHead}`}>
								<span>Email</span>
								<span>Rol</span>
								<span className="text-center">Acciones</span>
							</div>
							<div className="divide-y divide-black/10 bg-white">
								{usuariosFiltrados.length === 0 ? (
									<div className="px-4 py-8 text-center text-[#64748b]">
										No hay usuarios internos para el filtro seleccionado.
									</div>
								) : (
									usuariosFiltrados.map((usuario) => (
										<div key={usuario.id} className="grid grid-cols-[1fr_220px_120px] items-center px-4 py-3">
											<p className="text-sm font-semibold text-[#001830]">{usuario.email}</p>
											<div className="flex items-center gap-2">
												<RolControl
													usuario={usuario}
													disabled={actualizandoRolId === usuario.id}
													onChange={(rol) => void actualizarRol(usuario, rol)}
												/>
											</div>
											<div className="flex justify-center">
												{usuario.rol !== "Admin" && (
													<button
														type="button"
														onClick={() => setUsuarioAEliminar(usuario)}
														className={twBase.actionBtnDanger}
													>
														Eliminar
													</button>
												)}
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</div>
					<FeedbackRol feedback={feedbackRol} />
				</>
			)}

			{usuarioAEliminar && (
				<div className={twAdmin.adminModalOverlay}>
					<div className={twAdmin.adminModalCard}>
						<h3 className={twAdmin.adminModalTitle}>Eliminar usuario interno</h3>
						<p className={twAdmin.adminModalText}>
							Se eliminará el acceso de {usuarioAEliminar.email}. Esta acción no se puede deshacer.
						</p>
						<div className={twAdmin.adminModalActions}>
							<button
								type="button"
								disabled={eliminandoUsuarioId !== null}
								onClick={() => setUsuarioAEliminar(null)}
								className={twBase.actionBtnCancel}
							>
								Cancelar
							</button>
							<button
								type="button"
								disabled={eliminandoUsuarioId !== null}
								onClick={() => void eliminarUsuario()}
								className="h-9 rounded bg-[#b42318] px-3 text-sm font-semibold text-white hover:bg-[#991b1b] disabled:opacity-60"
							>
								{eliminandoUsuarioId !== null ? "Eliminando..." : "Eliminar"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const FeedbackRol = ({
	feedback,
}: {
	feedback: { tipo: "ok" | "error"; mensaje: string } | null;
}) => {
	if (!feedback) return null;

	return (
		<p className={`mt-2 text-right text-sm font-semibold ${feedback.tipo === "ok" ? "text-[#1E8E5A]" : "text-[#b91c1c]"}`}>
			{feedback.mensaje}
		</p>
	);
};

const RolControl = ({
	usuario,
	disabled,
	onChange,
}: {
	usuario: UsuarioInternoListado;
	disabled: boolean;
	onChange: (rol: RolUsuarioInterno) => void;
}) => {
	if (usuario.rol === "Admin") {
		return (
			<span className="w-fit rounded-full bg-[#eef5fd] px-2 py-0.5 text-xs font-semibold text-[#015cb9]">
				Admin
			</span>
		);
	}

	return (
		<select
			value={usuario.rol}
			disabled={disabled}
			onChange={(e) => onChange(e.target.value as RolUsuarioInterno)}
			className="h-8 w-full max-w-[160px] rounded-md border border-[#cdd6e1] bg-white px-2 text-sm text-[#001830] outline-none focus:border-[#015cb9] disabled:opacity-60"
		>
			<option value="Ventas">Ventas</option>
			<option value="Soporte">Soporte</option>
		</select>
	);
};
