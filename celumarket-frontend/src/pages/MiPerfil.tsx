import { useEffect, useState } from "react";
import { clienteService, type MiPerfil as MiPerfilData } from "../services/clienteService";
import { Footer } from "../components/Footer";
import { twBase, twCheckout, twLayout } from "../styles/tw";

export const MiPerfil = () => {
	const [perfil, setPerfil] = useState<MiPerfilData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [guardando, setGuardando] = useState(false);
	const [editandoDireccion, setEditandoDireccion] = useState(false);
	const [mensajeOk, setMensajeOk] = useState<string | null>(null);
	const [direccionForm, setDireccionForm] = useState({
		calle: "",
		numero: "",
		pisoDepto: "",
		localidad: "",
		provincia: "",
		codigoPostal: "",
	});

	useEffect(() => {
		const cargar = async () => {
			try {
				const data = await clienteService.obtenerMiPerfil();
				setPerfil(data);
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

	const guardarDireccion = async () => {
		if (!perfil) return;
		setError(null);
		setMensajeOk(null);

		if (!direccionForm.calle || !direccionForm.numero || !direccionForm.localidad || !direccionForm.provincia || !direccionForm.codigoPostal) {
			setError("Completá todos los campos obligatorios de dirección.");
			return;
		}

		const cp = Number(direccionForm.codigoPostal);
		if (!Number.isInteger(cp) || cp <= 0) {
			setError("El código postal no es válido.");
			return;
		}

		try {
			setGuardando(true);
			await clienteService.actualizarMiPerfil({
				telefono: perfil.telefono ?? "",
				calle: direccionForm.calle.trim(),
				numero: direccionForm.numero.trim(),
				pisoDepto: direccionForm.pisoDepto.trim(),
				localidad: direccionForm.localidad.trim(),
				provincia: direccionForm.provincia.trim(),
				codigoPostal: cp,
			});

			const actualizado = await clienteService.obtenerMiPerfil();
			setPerfil(actualizado);
			setDireccionForm({
				calle: actualizado.calleDireccion ?? "",
				numero: actualizado.numeroDireccion ?? "",
				pisoDepto: actualizado.pisoDeptoDireccion ?? "",
				localidad: actualizado.localidadDireccion ?? "",
				provincia: actualizado.provinciaDireccion ?? "",
				codigoPostal: actualizado.codigoPostalDireccion ? String(actualizado.codigoPostalDireccion) : "",
			});
			setEditandoDireccion(false);
			setMensajeOk("Dirección actualizada correctamente.");
		} catch {
			setError("No se pudo actualizar la dirección.");
		} finally {
			setGuardando(false);
		}
	};

	return (
		<div className={twLayout.pageShell}>
			<section className={twLayout.pageSection}>
				<h1 className="mb-6 text-3xl font-bold text-[#001830]">Mi perfil</h1>
				{error && <p className="text-red-600">{error}</p>}
				{mensajeOk && <p className="text-[#1E8E5A]">{mensajeOk}</p>}
				{!error && !perfil && <p className="text-gray-600">Cargando perfil...</p>}
				{perfil && (
					<div className="space-y-5 rounded-lg bg-white p-6 shadow-sm">
						<div>
							<p className="text-sm text-[#6b7280]">Nombre</p>
							<p className="text-lg font-semibold text-[#1e1e1e]">{perfil.nombreCompleto}</p>
						</div>
						<div>
							<p className="text-sm text-[#6b7280]">Email</p>
							<p className="text-lg text-[#1e1e1e]">{perfil.email ?? "—"}</p>
						</div>
						<div>
							<p className="text-sm text-[#6b7280]">Teléfono</p>
							<p className="text-lg text-[#1e1e1e]">{perfil.telefono ?? "—"}</p>
						</div>
						<div>
							<p className="text-sm text-[#6b7280]">DNI</p>
							<p className="text-lg text-[#1e1e1e]">{perfil.dni ?? "—"}</p>
						</div>
						<div>
							<div className="flex items-center justify-between gap-3">
								<p className="text-sm text-[#6b7280]">Dirección de envío</p>
								{!editandoDireccion && (
									<button onClick={() => setEditandoDireccion(true)} className="rounded-md bg-[#015cb9] px-3 py-1.5 text-sm text-white transition-colors hover:bg-[#017AF4]">
										Editar dirección
									</button>
								)}
							</div>
							{!editandoDireccion ? (
								<p className="text-lg text-[#1e1e1e]">{perfil.direccionCompleta ?? "No tienes una dirección guardada todavía."}</p>
							) : (
								<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
									<input value={direccionForm.calle} onChange={(e) => setDireccionForm((s) => ({ ...s, calle: e.target.value }))} className={twCheckout.checkoutInput} placeholder="Calle" />
									<input value={direccionForm.numero} onChange={(e) => setDireccionForm((s) => ({ ...s, numero: e.target.value }))} className={twCheckout.checkoutInput} placeholder="Número" />
									<input value={direccionForm.pisoDepto} onChange={(e) => setDireccionForm((s) => ({ ...s, pisoDepto: e.target.value }))} className={twCheckout.checkoutInput} placeholder="Piso/Depto (opcional)" />
									<input value={direccionForm.localidad} onChange={(e) => setDireccionForm((s) => ({ ...s, localidad: e.target.value }))} className={twCheckout.checkoutInput} placeholder="Localidad" />
									<input value={direccionForm.provincia} onChange={(e) => setDireccionForm((s) => ({ ...s, provincia: e.target.value }))} className={twCheckout.checkoutInput} placeholder="Provincia" />
									<input value={direccionForm.codigoPostal} onChange={(e) => setDireccionForm((s) => ({ ...s, codigoPostal: e.target.value }))} className={twCheckout.checkoutInput} placeholder="Código postal" />
									<div className="md:col-span-2 flex gap-2">
										<button disabled={guardando} onClick={guardarDireccion} className={`${twBase.actionBtnPrimary} h-10 px-4 text-sm ${guardando ? "bg-[#94a3b8] hover:bg-[#94a3b8]" : ""}`}>
											{guardando ? "Guardando..." : "Guardar dirección"}
										</button>
										<button
											disabled={guardando}
											onClick={() => {
												setEditandoDireccion(false);
												setDireccionForm({
													calle: perfil.calleDireccion ?? "",
													numero: perfil.numeroDireccion ?? "",
													pisoDepto: perfil.pisoDeptoDireccion ?? "",
													localidad: perfil.localidadDireccion ?? "",
													provincia: perfil.provinciaDireccion ?? "",
													codigoPostal: perfil.codigoPostalDireccion ? String(perfil.codigoPostalDireccion) : "",
												});
											}}
											className={`${twBase.secondaryBtnSm} h-10 px-4 text-sm`}
										>
											Cancelar
										</button>
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
