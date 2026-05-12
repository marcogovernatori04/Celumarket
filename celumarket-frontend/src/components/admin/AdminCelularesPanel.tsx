import { useEffect, useState } from "react";
import axios from "axios";
import { celularService } from "../../services/celularService";
import { stockService } from "../../services/stockService";
import type { CelularListado } from "../../models/Celular";
import type { CelularDetalle } from "../../models/CelularDetalle";
import { CelularDetalleExpandido } from "./celulares/CelularDetalleExpandido";

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
	const [expandidoId, setExpandidoId] = useState<number | null>(null);
	const [detallePorId, setDetallePorId] = useState<Record<number, CelularDetalle>>({});
	const [cargandoDetalleId, setCargandoDetalleId] = useState<number | null>(null);

	useEffect(() => {
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

		void cargarTodo();
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

	return (
		<div>
			<h2 className="text-2xl font-bold text-[#001830]">Celulares</h2>
			<p className="mt-1 text-sm text-[#5b6673]">Listado general con detalle expandible por equipo.</p>

			{cargando && <p className="mt-6 text-[#5b6673]">Cargando celulares...</p>}
			{error && <p className="mt-6 text-red-600">{error}</p>}

			{!cargando && !error && (
				<div className="mt-6 overflow-hidden rounded-xl border border-black/10">
					<div className="grid grid-cols-[84px_1.2fr_1fr_1fr_90px] items-center bg-[#eef3f8] px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155]">
						<span>Imagen</span>
						<span>Modelo</span>
						<span>Precio base</span>
						<span>Colores</span>
						<span className="text-center">Ver más</span>
					</div>
					<div className="divide-y divide-black/10 bg-white">
						{celulares.map((c) => {
							const detalle = detallePorId[c.id];
							const expandido = expandidoId === c.id;
							return (
								<div key={c.id}>
									<div className="grid grid-cols-[84px_1.2fr_1fr_1fr_90px] items-center px-4 py-3">
										<div className="h-14 w-14 overflow-hidden rounded-md bg-[#ececec]">
											<img src={c.urlImagenPrincipal} alt={`${c.marca} ${c.modelo}`} className="h-full w-full object-contain" />
										</div>
										<div>
											<p className="text-base font-semibold text-[#001830]">{c.marca} {c.modelo}</p>
										</div>
										<p className="text-sm text-[#1e293b]">${c.precioMinimo.toLocaleString("es-AR")}</p>
										<p className="text-sm text-[#1e293b]">{c.cantidadColores}</p>
										<div className="flex justify-center">
											<button
												onClick={() => void toggleDetalle(c.id)}
												className="flex h-8 w-8 items-center justify-center rounded-md border border-[#cdd6e1] text-lg font-semibold text-[#015cb9] transition-colors hover:bg-[#eef5fd]"
											>
												{expandido ? "−" : "+"}
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
												/>
											)}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};
