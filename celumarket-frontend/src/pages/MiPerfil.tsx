import { useEffect, useState } from "react";
import { clienteService, type MiPerfil as MiPerfilData } from "../services/clienteService";
import { Footer } from "../components/Footer";
import { twBase, twCheckout, twLayout } from "../styles/tw";
import { esEnteroPositivo, esTelefonoValido, esTextoUbicacionValido } from "../utils/validation";

export const MiPerfil = () => {
	const [perfil, setPerfil] = useState<MiPerfilData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [guardando, setGuardando] = useState(false);
	const [editandoDatos, setEditandoDatos] = useState(false);
	const [mensajeOk, setMensajeOk] = useState<string | null>(null);
	const [telefonoForm, setTelefonoForm] = useState("");
	const [direccionForm, setDireccionForm] = useState({
		calle: "",
		numero: "",
		pisoDepto: "",
		localidad: "",
		provincia: "",
		codigoPostal: "",
	});
	const mostrarErrorEdicion = Boolean(error && perfil && editandoDatos);

	useEffect(() => {
		const cargar = async () => {
			try {
				const data = await clienteService.obtenerMiPerfil();
				setPerfil(data);
				setTelefonoForm(data.telefono ?? "");
				setDireccionForm({
					calle: data.calleDireccion ?? "",
					numero: data.numeroDireccion ?? "",
					pisoDepto: data.pisoDeptoDireccion ?? "",
					localidad: data.localidadDireccion ?? "",
					provincia: data.provinciaDireccion ?? "",
					codigoPostal: data.codigoPostalDireccion ? String(data.codigoPostalDireccion) : "",
				});
			} catch {
				setError("No se pudo cargar tu perfil.");
			}
		};
		void cargar();
	}, []);

	const resetearFormulario = (datos: MiPerfilData) => {
		setTelefonoForm(datos.telefono ?? "");
		setDireccionForm({
			calle: datos.calleDireccion ?? "",
			numero: datos.numeroDireccion ?? "",
			pisoDepto: datos.pisoDeptoDireccion ?? "",
			localidad: datos.localidadDireccion ?? "",
			provincia: datos.provinciaDireccion ?? "",
			codigoPostal: datos.codigoPostalDireccion ? String(datos.codigoPostalDireccion) : "",
		});
	};

	const guardarDatos = async () => {
		if (!perfil) return;
		setError(null);
		setMensajeOk(null);

		if (!telefonoForm.trim()) {
			setError("Completá el teléfono.");
			return;
		}

		if (!esTelefonoValido(telefonoForm)) {
			setError("El teléfono debe ser válido y no debe contener letras.");
			return;
		}

		if (!direccionForm.calle || !direccionForm.numero || !direccionForm.localidad || !direccionForm.provincia || !direccionForm.codigoPostal) {
			setError("Completá todos los campos obligatorios de dirección.");
			return;
		}

		if (!esEnteroPositivo(direccionForm.numero)) {
			setError("El número de dirección debe ser un número válido.");
			return;
		}

		if (!esTextoUbicacionValido(direccionForm.localidad)) {
			setError("La localidad no debe contener números.");
			return;
		}

		if (!esTextoUbicacionValido(direccionForm.provincia)) {
			setError("La provincia no debe contener números.");
			return;
		}

		const cp = Number(direccionForm.codigoPostal);
		if (!esEnteroPositivo(direccionForm.codigoPostal)) {
			setError("El código postal no es válido.");
			return;
		}

		try {
			setGuardando(true);
			await clienteService.actualizarMiPerfil({
				telefono: telefonoForm.trim(),
				calle: direccionForm.calle.trim(),
				numero: direccionForm.numero.trim(),
				pisoDepto: direccionForm.pisoDepto.trim(),
				localidad: direccionForm.localidad.trim(),
				provincia: direccionForm.provincia.trim(),
				codigoPostal: cp,
			});

			const actualizado = await clienteService.obtenerMiPerfil();
			setPerfil(actualizado);
			resetearFormulario(actualizado);
			setEditandoDatos(false);
			setMensajeOk("Datos actualizados correctamente.");
		} catch {
			setError("No se pudieron actualizar los datos.");
		} finally {
			setGuardando(false);
		}
	};

	return (
		<div className={twLayout.pageShell}>
			<section className={twLayout.pageSection}>
				<h1 className="mb-6 text-2xl font-bold text-[#001830] sm:text-3xl">Mi perfil</h1>
				{error && !mostrarErrorEdicion && <p className="text-red-600">{error}</p>}
				{mensajeOk && <p className="text-[#1E8E5A]">{mensajeOk}</p>}
				{!error && !perfil && <p className="text-gray-600">Cargando perfil...</p>}
				{perfil && (
					<div className="space-y-5 rounded-lg bg-white p-4 shadow-sm sm:p-6">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
							<div>
								<p className="text-sm text-[#6b7280]">Nombre</p>
								<p className="text-lg font-semibold text-[#1e1e1e]">{perfil.nombreCompleto}</p>
							</div>
							{!editandoDatos && (
								<button
									onClick={() => {
										setEditandoDatos(true);
										setError(null);
										setMensajeOk(null);
									}}
									className="h-9 w-fit rounded-md border border-[#015cb9] bg-white px-3 text-sm font-medium text-[#015cb9] transition-colors hover:bg-[#eef5fd]"
								>
									Editar datos
								</button>
							)}
						</div>
						<div>
							<p className="text-sm text-[#6b7280]">Email</p>
							<p className="text-lg text-[#1e1e1e]">{perfil.email ?? "—"}</p>
						</div>
						<div>
							<p className="text-sm text-[#6b7280]">Teléfono</p>
							{editandoDatos ? (
								<input value={telefonoForm} onChange={(e) => setTelefonoForm(e.target.value)} className={`${twCheckout.checkoutInput} mt-2 sm:max-w-[320px]`} placeholder="Teléfono" inputMode="tel" />
							) : (
								<p className="text-lg text-[#1e1e1e]">{perfil.telefono ?? "—"}</p>
							)}
						</div>
						<div>
							<p className="text-sm text-[#6b7280]">DNI</p>
							<p className="text-lg text-[#1e1e1e]">{perfil.dni ?? "—"}</p>
						</div>
						<div>
							{!editandoDatos ? (
								<div className="rounded-lg border border-[#dfe5eb] bg-[#f8fafc] p-4">
									<div className="min-w-0">
										<p className="text-sm font-medium text-[#6b7280]">Dirección de envío</p>
										<p className="mt-1 break-words text-[17px] leading-snug text-[#1e1e1e]">
											{perfil.direccionCompleta ?? "No tienes una dirección guardada todavía."}
										</p>
									</div>
								</div>
							) : (
								<div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
									<input value={direccionForm.calle} onChange={(e) => setDireccionForm((s) => ({ ...s, calle: e.target.value }))} className={twCheckout.checkoutInput} placeholder="Calle" />
									<input value={direccionForm.numero} onChange={(e) => setDireccionForm((s) => ({ ...s, numero: e.target.value }))} className={twCheckout.checkoutInput} placeholder="Número" inputMode="numeric" />
									<input value={direccionForm.pisoDepto} onChange={(e) => setDireccionForm((s) => ({ ...s, pisoDepto: e.target.value }))} className={twCheckout.checkoutInput} placeholder="Piso/Depto (opcional)" />
									<input value={direccionForm.localidad} onChange={(e) => setDireccionForm((s) => ({ ...s, localidad: e.target.value }))} className={twCheckout.checkoutInput} placeholder="Localidad" />
									<input value={direccionForm.provincia} onChange={(e) => setDireccionForm((s) => ({ ...s, provincia: e.target.value }))} className={twCheckout.checkoutInput} placeholder="Provincia" />
									<input value={direccionForm.codigoPostal} onChange={(e) => setDireccionForm((s) => ({ ...s, codigoPostal: e.target.value }))} className={twCheckout.checkoutInput} placeholder="Código postal" inputMode="numeric" />
									<div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row">
										<button disabled={guardando} onClick={guardarDatos} className={`${twBase.actionBtnPrimary} h-10 px-4 text-sm ${guardando ? "bg-[#94a3b8] hover:bg-[#94a3b8]" : ""}`}>
											{guardando ? "Guardando..." : "Guardar cambios"}
										</button>
										<button
											disabled={guardando}
											onClick={() => {
												setEditandoDatos(false);
												setError(null);
												resetearFormulario(perfil);
											}}
											className={`${twBase.secondaryBtnSm} h-10 px-4 text-sm`}
										>
											Cancelar
										</button>
										{mostrarErrorEdicion && (
											<p className="text-sm font-semibold text-red-600 sm:self-center">
												{error}
											</p>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</section>
			<Footer />
		</div>
	);
};
