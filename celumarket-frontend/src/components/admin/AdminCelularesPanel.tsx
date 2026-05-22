import { useEffect, useState } from "react";
import axios from "axios";
import { celularService } from "../../services/celularService";
import { stockService } from "../../services/stockService";
import type { CelularListado } from "../../models/Celular";
import type { CelularDetalle } from "../../models/CelularDetalle";
import { CelularDetalleExpandido } from "./celulares/CelularDetalleExpandido";
import { ColorSelector } from "./celulares/ColorSelector";
import { colorService, type ColorItem } from "../../services/colorService";
import { twAdmin, twBase } from "../../styles/tw";

type NuevaVariacion = {
	colorId: number | null;
	precio: string;
	almacenamiento: string;
	stockInicial: string;
	imagenes: File[];
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

export const AdminCelularesPanel = () => {
	const [celulares, setCelulares] = useState<CelularListado[]>([]);
	const [cargando, setCargando] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [busqueda, setBusqueda] = useState("");
	const [creando, setCreando] = useState(false);
	const [guardandoCreacion, setGuardandoCreacion] = useState(false);
	const [eliminandoCelularId, setEliminandoCelularId] = useState<number | null>(null);
	const [mostrarModalEliminarCelularId, setMostrarModalEliminarCelularId] = useState<number | null>(null);
	const [colores, setColores] = useState<ColorItem[]>([]);
	const [nuevoCelular, setNuevoCelular] = useState({
		marca: "",
		modelo: "",
		descripcion: "",
	});
	const [nuevasVariaciones, setNuevasVariaciones] = useState<NuevaVariacion[]>([
		{ colorId: null, precio: "", almacenamiento: "", stockInicial: "", imagenes: [] },
	]);
	const [nuevasEspecificaciones, setNuevasEspecificaciones] = useState<Array<{ nombre: string; valor: string }>>([]);
	const [expandidoId, setExpandidoId] = useState<number | null>(null);
	const [detallePorId, setDetallePorId] = useState<Record<number, CelularDetalle>>({});
	const [cargandoDetalleId, setCargandoDetalleId] = useState<number | null>(null);

	const cargarTodo = async () => {
		try {
			setCargando(true);
			setError(null);
			const acumulados: CelularListado[] = [];
			let pagina = 1;
			let totalPaginas = 1;

			do {
				const data = await celularService.obtenerCatalogoPaginado(pagina, 50);
				acumulados.push(...data.items);
				totalPaginas = data.totalPaginas || 1;
				pagina += 1;
			} while (pagina <= totalPaginas);

			setCelulares(acumulados);
		} catch {
			setError("No se pudo cargar el listado de celulares.");
		} finally {
			setCargando(false);
		}
	};

	useEffect(() => {
		void cargarTodo();
		void (async () => {
			try {
				const data = await colorService.listarActivos();
				setColores(data);
			} catch {
				setError("No se pudo cargar la lista de colores.");
			}
		})();
	}, []);

	const refrescarDetalle = async (celularId: number) => {
		const detalle = await celularService.obtenerDetalle(celularId);
		setDetallePorId((prev) => ({ ...prev, [celularId]: detalle }));
	};

	const toggleDetalle = async (celularId: number) => {
		if (expandidoId === celularId) {
			setExpandidoId(null);
			return;
		}
		setExpandidoId(celularId);
		if (detallePorId[celularId]) return;
		try {
			setCargandoDetalleId(celularId);
			await refrescarDetalle(celularId);
		} finally {
			setCargandoDetalleId(null);
		}
	};

	const guardarDescripcion = async (detalle: CelularDetalle, descripcion: string) => {
		try {
			setError(null);
			await celularService.modificarCelular({
				id: detalle.id,
				marca: detalle.marca,
				modelo: detalle.modelo,
				descripcion,
			});
			await refrescarDetalle(detalle.id);
		} catch (err) {
			setError(obtenerMensajeApi(err, "No se pudo guardar la descripción."));
			throw err;
		}
	};

	const guardarEspecificaciones = async (detalle: CelularDetalle, especificaciones: Array<{ nombre: string; valor: string }>) => {
		try {
			setError(null);
			await celularService.reemplazarEspecificaciones(detalle.id, especificaciones);
			await refrescarDetalle(detalle.id);
		} catch (err) {
			setError(obtenerMensajeApi(err, "No se pudieron guardar las especificaciones."));
			throw err;
		}
	};

	const guardarVariacion = async (payload: {
		variacionId: number;
		colorId: number;
		precio: number;
		precioAnterior?: number | null;
		almacenamiento: string;
	}) => {
		try {
			setError(null);
			await celularService.modificarVariacion(payload);
			if (expandidoId) await refrescarDetalle(expandidoId);
		} catch (err) {
			setError(obtenerMensajeApi(err, "No se pudo guardar la variación."));
			throw err;
		}
	};

	const ajustarStock = async (variacionId: number, cantidad: number, tipo: "ingreso" | "perdida") => {
		try {
			setError(null);
			if (tipo === "ingreso") {
				await stockService.ingresar(variacionId, cantidad);
			} else {
				await stockService.registrarPerdida(variacionId, cantidad);
			}
			if (expandidoId) await refrescarDetalle(expandidoId);
		} catch (err) {
			setError(obtenerMensajeApi(err, "No se pudo ajustar el stock."));
			throw err;
		}
	};

	const subirImagen = async (variacionId: number, archivo: File) => {
		try {
			setError(null);
			await celularService.subirImagenVariacion(variacionId, archivo);
			if (expandidoId) await refrescarDetalle(expandidoId);
		} catch (err) {
			setError(obtenerMensajeApi(err, "No se pudo subir la imagen."));
			throw err;
		}
	};

	const eliminarImagen = async (variacionId: number, url: string) => {
		try {
			setError(null);
			await celularService.eliminarImagenVariacion(variacionId, url);
			if (expandidoId) await refrescarDetalle(expandidoId);
		} catch (err) {
			setError(obtenerMensajeApi(err, "No se pudo eliminar la imagen."));
			throw err;
		}
	};

	const eliminarVariacion = async (variacionId: number) => {
		try {
			setError(null);
			await celularService.eliminarVariacion(variacionId);
			if (expandidoId) {
				await refrescarDetalle(expandidoId);
			}
		} catch (err) {
			setError(obtenerMensajeApi(err, "No se pudo eliminar la variación."));
			throw err;
		}
	};

	const agregarVariacion = async (payload: {
		celularId: number;
		colorId: number;
		precio: number;
		precioAnterior?: number | null;
		almacenamiento: string;
		stockInicial: number;
		imagenes: File[];
	}) => {
		try {
			setError(null);
			const variacionId = await celularService.agregarVariacion({
				celularId: payload.celularId,
				colorId: payload.colorId,
				precio: payload.precio,
				precioAnterior: payload.precioAnterior,
				almacenamiento: payload.almacenamiento,
				stockInicial: payload.stockInicial,
			});
			for (let i = 0; i < payload.imagenes.length; i += 1) {
				await celularService.subirImagenVariacion(variacionId, payload.imagenes[i], i === 0);
			}
			await refrescarDetalle(payload.celularId);
		} catch (err) {
			setError(obtenerMensajeApi(err, "No se pudo agregar la variación."));
			throw err;
		}
	};

	const eliminarCelular = async (celularId: number) => {
		try {
			setEliminandoCelularId(celularId);
			setError(null);
			await celularService.eliminarCelular(celularId);
			if (expandidoId === celularId) {
				setExpandidoId(null);
			}
			setDetallePorId((prev) => {
				const next = { ...prev };
				delete next[celularId];
				return next;
			});
			await cargarTodo();
			setMostrarModalEliminarCelularId(null);
		} catch (err) {
			setError(obtenerMensajeApi(err, "No se pudo eliminar el celular."));
		} finally {
			setEliminandoCelularId(null);
		}
	};

	const crearNuevoCelular = async () => {
		if (!nuevoCelular.marca.trim() || !nuevoCelular.modelo.trim() || !nuevoCelular.descripcion.trim()) {
			setError("Completa marca, modelo y descripción.");
			return;
		}
		if (nuevasVariaciones.length === 0) {
			setError("Añadí al menos una variación.");
			return;
		}
		for (const v of nuevasVariaciones) {
			const colorId = Number(v.colorId);
			const precio = Number(v.precio);
			const stockInicial = Number(v.stockInicial);
			if (!Number.isInteger(colorId) || colorId <= 0) {
				setError("Cada variación debe tener un color válido.");
				return;
			}
			if (!Number.isFinite(precio) || precio <= 0) {
				setError("Cada variación debe tener un precio válido.");
				return;
			}
			if (!Number.isInteger(stockInicial) || stockInicial < 0) {
				setError("Cada variación debe tener stock inicial válido.");
				return;
			}
			if (!v.almacenamiento.trim()) {
				setError("Cada variación debe tener almacenamiento.");
				return;
			}
		}
		try {
			setGuardandoCreacion(true);
			setError(null);
			const celularId = await celularService.crearCelular({
				marca: nuevoCelular.marca.trim(),
				modelo: nuevoCelular.modelo.trim(),
				descripcion: nuevoCelular.descripcion.trim(),
			});
			for (const v of nuevasVariaciones) {
				const variacionId = await celularService.agregarVariacion({
					celularId,
					colorId: Number(v.colorId),
					precio: Number(v.precio),
					precioAnterior: null,
					almacenamiento: v.almacenamiento.trim(),
					stockInicial: Number(v.stockInicial),
				});
				for (let i = 0; i < v.imagenes.length; i += 1) {
					await celularService.subirImagenVariacion(variacionId, v.imagenes[i], i === 0);
				}
			}
			const specs = nuevasEspecificaciones
				.map((s) => ({ nombre: s.nombre.trim(), valor: s.valor.trim() }))
				.filter((s) => s.nombre && s.valor);
			if (specs.length > 0) {
				await celularService.reemplazarEspecificaciones(celularId, specs);
			}
			await cargarTodo();
			setCreando(false);
			setNuevoCelular({
				marca: "",
				modelo: "",
				descripcion: "",
			});
			setNuevasVariaciones([{ colorId: null, precio: "", almacenamiento: "", stockInicial: "", imagenes: [] }]);
			setNuevasEspecificaciones([]);
		} catch (err) {
			setError(obtenerMensajeApi(err, "No se pudo crear el celular."));
		} finally {
			setGuardandoCreacion(false);
		}
	};

	const crearColor = async (nombre: string, hex: string): Promise<number> => {
		const colorId = await colorService.crear(nombre, hex);
		const actualizados = await colorService.listarActivos();
		setColores(actualizados);
		return colorId;
	};

	const busquedaNormalizada = busqueda.trim().toLowerCase();
	const celularesFiltrados = celulares.filter((c) => {
		if (!busquedaNormalizada) return true;
		const termino = busquedaNormalizada.startsWith("#")
			? busquedaNormalizada.slice(1)
			: busquedaNormalizada;
		const esSoloDigitos = /^\d+$/.test(termino);
		const idMatch = esSoloDigitos ? String(c.id) === termino : false;
		const texto = `${c.marca} ${c.modelo}`.toLowerCase();
		const nombreMatch = texto.includes(termino);
		return idMatch || nombreMatch;
	});

	if (cargando) {
		return (
			<div className={twBase.loadingBox}>
				<p className="text-[#5b6673]">Cargando celulares...</p>
			</div>
		);
	}

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex items-center justify-between gap-3">
				<h2 className={twAdmin.adminSectionTitle}>Celulares</h2>
				<button
					onClick={() => setCreando((v) => !v)}
					className={twBase.actionBtnPrimary}
				>
					{creando ? "Cancelar alta" : "Nuevo celular"}
				</button>
			</div>
			<p className={twAdmin.adminSectionSubtitle}>Listado general con detalle expandible por equipo.</p>
			<div className="mt-3">
				<input
					value={busqueda}
					onChange={(e) => setBusqueda(e.target.value)}
					placeholder="Buscar por #id, marca o modelo..."
					className={`${twBase.searchInput} w-full max-w-[360px]`}
				/>
			</div>
			{creando && (
				<div className={`mt-4 ${twAdmin.adminCard}`}>
					<p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#64748b]">Alta de celular</p>
					<div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
						<input placeholder="Marca" value={nuevoCelular.marca} onChange={(e) => setNuevoCelular((p) => ({ ...p, marca: e.target.value }))} className={twAdmin.adminInput} />
						<input placeholder="Modelo" value={nuevoCelular.modelo} onChange={(e) => setNuevoCelular((p) => ({ ...p, modelo: e.target.value }))} className={twAdmin.adminInput} />
					</div>
					<textarea placeholder="Descripción" value={nuevoCelular.descripcion} onChange={(e) => setNuevoCelular((p) => ({ ...p, descripcion: e.target.value }))} className={`mt-2 ${twAdmin.adminTextarea}`} rows={3} />
					<div className={`mt-3 ${twAdmin.adminSubCard}`}>
						<div className="mb-2 flex items-center justify-between">
							<p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#64748b]">Variaciones</p>
							<button
								onClick={() => setNuevasVariaciones((prev) => [...prev, { colorId: null, precio: "", almacenamiento: "", stockInicial: "", imagenes: [] }])}
								className={twAdmin.adminGhostBtn}
							>
								+ Añadir variación
							</button>
						</div>
						<div className="space-y-3">
							{nuevasVariaciones.map((v, idx) => (
								<div key={`nueva-var-${idx}`} className={twAdmin.adminWhiteCard}>
									<div className="mb-2 flex items-center justify-between">
										<p className="text-xs font-semibold text-[#475569]">Variación #{idx + 1}</p>
										{nuevasVariaciones.length > 1 && (
											<button
												onClick={() => setNuevasVariaciones((prev) => prev.filter((_, i) => i !== idx))}
												className={twAdmin.adminDangerBtnXs}
											>
												Quitar
											</button>
										)}
									</div>
									<div className="grid grid-cols-1 gap-2 md:grid-cols-4">
										<ColorSelector
											value={v.colorId}
											colores={colores}
											onChange={(colorId) => setNuevasVariaciones((prev) => prev.map((it, i) => i === idx ? { ...it, colorId } : it))}
											onCrearColor={crearColor}
										/>
										<input placeholder="Almacenamiento" value={v.almacenamiento} onChange={(e) => setNuevasVariaciones((prev) => prev.map((it, i) => i === idx ? { ...it, almacenamiento: e.target.value } : it))} className={twAdmin.adminInput} />
										<input placeholder="Precio" type="number" value={v.precio} onChange={(e) => setNuevasVariaciones((prev) => prev.map((it, i) => i === idx ? { ...it, precio: e.target.value } : it))} className={twAdmin.adminInput} />
									</div>
									<div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
										<input placeholder="Stock inicial" type="number" value={v.stockInicial} onChange={(e) => setNuevasVariaciones((prev) => prev.map((it, i) => i === idx ? { ...it, stockInicial: e.target.value } : it))} className={twAdmin.adminInput} />
										<div>
											<input
												id={`nueva-variacion-imagenes-${idx}`}
												type="file"
												accept="image/*"
												multiple
												onChange={(e) => {
													const nuevos = Array.from(e.target.files ?? []);
													if (nuevos.length === 0) return;
													setNuevasVariaciones((prev) =>
														prev.map((it, i) =>
															i === idx ? { ...it, imagenes: [...it.imagenes, ...nuevos] } : it,
														),
													);
												}}
												className="hidden"
											/>
											<label
												htmlFor={`nueva-variacion-imagenes-${idx}`}
												className="inline-flex h-9 cursor-pointer items-center rounded border border-[#cdd6e1] bg-white px-3 text-xs font-semibold text-[#334155] hover:bg-[#f8fafc]"
											>
												Seleccionar imágenes
											</label>
											{v.imagenes.length > 0 && (
												<p className="mt-1 text-xs text-[#475569]">
													{v.imagenes.length} imagen(es) seleccionadas. La primera será principal.
												</p>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className={`mt-3 ${twAdmin.adminSubCard}`}>
						<p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#64748b]">Especificaciones</p>
						<div className="mt-2 space-y-2">
							{nuevasEspecificaciones.map((s, idx) => (
								<div key={`nueva-spec-${idx}`} className="grid grid-cols-[1fr_1fr_auto] gap-2">
									<input placeholder="Nombre" value={s.nombre} onChange={(e) => setNuevasEspecificaciones((prev) => prev.map((it, i) => i === idx ? { ...it, nombre: e.target.value } : it))} className={twAdmin.adminInput} />
									<input placeholder="Valor" value={s.valor} onChange={(e) => setNuevasEspecificaciones((prev) => prev.map((it, i) => i === idx ? { ...it, valor: e.target.value } : it))} className={twAdmin.adminInput} />
									<button onClick={() => setNuevasEspecificaciones((prev) => prev.filter((_, i) => i !== idx))} className={twAdmin.adminDangerBtnSm}>Quitar</button>
								</div>
							))}
							<button onClick={() => setNuevasEspecificaciones((prev) => [...prev, { nombre: "", valor: "" }])} className={twAdmin.adminGhostBtn}>
								+ Añadir especificación
							</button>
						</div>
					</div>
					<div className="mt-3">
						<button disabled={guardandoCreacion} onClick={() => void crearNuevoCelular()} className={twAdmin.adminPrimaryBtnSm}>
							{guardandoCreacion ? "Creando..." : "Crear celular"}
						</button>
					</div>
				</div>
			)}

			{error && <p className="mt-6 text-red-600">{error}</p>}

			{!error && (
				<div className={twBase.tableShell}>
					<div className={`grid grid-cols-[110px_1.2fr_1fr_1fr_1fr_90px_100px] items-center px-4 py-3 ${twBase.tableHead}`}>
						<span>Imagen</span>
						<span>Modelo</span>
						<span>Precio base</span>
						<span>Colores</span>
						<span>Stock total</span>
						<span className="text-center">Ver más</span>
						<span className="text-center">Borrar</span>
					</div>
					<div className="divide-y divide-black/10 bg-white">
						{celularesFiltrados.map((c) => {
							const detalle = detallePorId[c.id];
							const expandido = expandidoId === c.id;
							return (
								<div key={c.id}>
									<div className="grid grid-cols-[110px_1.2fr_1fr_1fr_1fr_90px_100px] items-center px-4 py-3">
										<div className="h-20 w-20 overflow-hidden rounded-md bg-[#ececec]">
											<img src={c.urlImagenPrincipal} alt={`${c.marca} ${c.modelo}`} className="h-20 w-20 object-contain" />
										</div>
										<div>
											<p className="text-base font-semibold text-[#001830]">{c.marca} {c.modelo}</p>
											{expandido && detalle?.descripcion && (
												<p className="mt-1 line-clamp-2 text-xs text-[#64748b]">
													{detalle.descripcion}
												</p>
											)}
										</div>
										<p className="text-sm text-[#1e293b]">${c.precioMinimo.toLocaleString("es-AR")}</p>
										<p className="text-sm text-[#1e293b]">{c.cantidadColores}</p>
										<p className="text-sm font-semibold text-[#1e293b]">{c.stockTotal}</p>
										<div className="flex justify-center">
											<button
												onClick={() => void toggleDetalle(c.id)}
												className={twBase.iconButton}
											>
												{expandido ? "−" : "+"}
											</button>
										</div>
										<div className="flex justify-center">
											<button
												onClick={() => setMostrarModalEliminarCelularId(c.id)}
												className={twBase.actionBtnDanger}
											>
												Eliminar
											</button>
										</div>
									</div>

									{expandido && (
										<div className="border-t border-black/10 bg-[#f8fafc] px-5 py-4">
											{cargandoDetalleId === c.id && <p className="text-sm text-[#5b6673]">Cargando detalle...</p>}
											{!cargandoDetalleId && detalle && (
												<CelularDetalleExpandido
													detalle={detalle}
													onGuardarDescripcion={guardarDescripcion}
													onGuardarEspecificaciones={guardarEspecificaciones}
													onGuardarVariacion={guardarVariacion}
													onAjustarStock={ajustarStock}
													onSubirImagen={subirImagen}
													onEliminarImagen={eliminarImagen}
													onEliminarVariacion={eliminarVariacion}
													colores={colores}
													onCrearColor={crearColor}
													onAgregarVariacion={agregarVariacion}
												/>
											)}
										</div>
									)}
								</div>
							);
						})}
						{celularesFiltrados.length === 0 && (
							<div className="px-4 py-8 text-center text-[#64748b]">
								No hay celulares para esa búsqueda.
							</div>
						)}
					</div>
				</div>
			)}

			{mostrarModalEliminarCelularId !== null && (
				<div className={twAdmin.adminModalOverlay}>
					<div className={twAdmin.adminModalCard}>
						<h3 className={twAdmin.adminModalTitle}>Eliminar celular</h3>
						<p className={twAdmin.adminModalText}>
							Se eliminará el celular completo junto con sus variaciones e imágenes. Esta acción no se puede deshacer.
						</p>
						<div className={twAdmin.adminModalActions}>
							<button
								disabled={eliminandoCelularId !== null}
								onClick={() => setMostrarModalEliminarCelularId(null)}
								className="h-9 rounded border border-[#cdd6e1] bg-white px-3 text-sm font-semibold text-[#334155] hover:bg-[#f8fafc] disabled:opacity-60"
							>
								Cancelar
							</button>
							<button
								disabled={eliminandoCelularId !== null}
								onClick={() => void eliminarCelular(mostrarModalEliminarCelularId)}
								className="h-9 rounded bg-[#b42318] px-3 text-sm font-semibold text-white hover:bg-[#991b1b] disabled:opacity-60"
							>
								{eliminandoCelularId !== null ? "Eliminando..." : "Eliminar"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
