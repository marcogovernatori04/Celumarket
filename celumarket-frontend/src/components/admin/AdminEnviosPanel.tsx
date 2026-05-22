import { Fragment, useEffect, useState } from "react";
import { pedidoService, type AdminEnvioItem } from "../../services/pedidoService";
import { twAdmin, twBase } from "../../styles/tw";

const formatearFecha = (raw?: string) => {
	if (!raw) return "—";
	const d = new Date(raw);
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleString("es-AR");
};

const formatearMonto = (monto?: number) =>
	`$${(monto ?? 0).toLocaleString("es-AR")}`;

const estaDespachado = (estado?: string) =>
	(estado ?? "").trim().toLowerCase().includes("despach");

type AdminEnviosPanelProps = {
	puedeGestionar?: boolean;
};

export const AdminEnviosPanel = ({ puedeGestionar = false }: AdminEnviosPanelProps) => {
	const [envios, setEnvios] = useState<AdminEnvioItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filtroEstado, setFiltroEstado] = useState<"todos" | "pendiente" | "despachado">("todos");
	const [busqueda, setBusqueda] = useState("");
	const [codigoSeguimientoPorEnvio, setCodigoSeguimientoPorEnvio] = useState<Record<number, string>>({});
	const [procesandoEnvioId, setProcesandoEnvioId] = useState<number | null>(null);
	const [expandidoId, setExpandidoId] = useState<number | null>(null);

	const cargarEnvios = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await pedidoService.listarEnviosAdmin();
			setEnvios(data);
		} catch {
			setError("No se pudieron cargar los envíos.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void cargarEnvios();
	}, []);

	const busquedaNormalizada = busqueda.trim().toLowerCase();
	const enviosFiltrados = envios
		.filter((envio) => {
			if (filtroEstado === "todos") return true;
			const despachado = estaDespachado(envio.estado);
			return filtroEstado === "despachado" ? despachado : !despachado;
		})
		.filter((envio) => {
			if (!busquedaNormalizada) return true;
			const termino = busquedaNormalizada.startsWith("#")
				? busquedaNormalizada.slice(1)
				: busquedaNormalizada;
			const esSoloDigitos = /^\d+$/.test(termino);
			const matchPedido = esSoloDigitos ? String(envio.pedidoId) === termino : false;
			const matchEnvio = esSoloDigitos ? String(envio.envioId) === termino : false;
			if (esSoloDigitos) return matchPedido || matchEnvio;

			const tokensEstado = (envio.estado ?? "")
				.toLowerCase()
				.split(/\s+/)
				.filter(Boolean);
			const tokensTipo = (envio.tipo ?? "")
				.toLowerCase()
				.split(/\s+/)
				.filter(Boolean);
			const tokensDireccion = (envio.direccionEntrega ?? "")
				.toLowerCase()
				.split(/\s+/)
				.filter(Boolean);
			const tokensTracking = (envio.codigoSeguimiento ?? "")
				.toLowerCase()
				.split(/\s+/)
				.filter(Boolean);

			const matchEstado = tokensEstado.some((token) => token.startsWith(termino));
			const matchTipo = tokensTipo.some((token) => token.startsWith(termino));
			const matchDireccion = tokensDireccion.some((token) => token.startsWith(termino));
			const matchTracking = tokensTracking.some((token) => token.startsWith(termino));
			return matchEstado || matchTipo || matchDireccion || matchTracking;
		});

	const despacharEnvio = async (envio: AdminEnvioItem) => {
		const codigo = (codigoSeguimientoPorEnvio[envio.envioId] ?? "").trim();
		if (!codigo) {
			setError("Ingresá un código de seguimiento para despachar.");
			return;
		}
		try {
			setProcesandoEnvioId(envio.envioId);
			setError(null);
			await pedidoService.despacharEnvioAdmin(envio.envioId, codigo);
			setCodigoSeguimientoPorEnvio((prev) => ({ ...prev, [envio.envioId]: "" }));
			await cargarEnvios();
		} catch {
			setError("No se pudo despachar el envío.");
		} finally {
			setProcesandoEnvioId(null);
		}
	};

	if (loading) {
		return (
			<div className={twBase.loadingBox}>
				<p className="text-[#5b6673]">Cargando envíos...</p>
			</div>
		);
	}

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div>
				<h2 className={twAdmin.adminSectionTitle}>Envíos</h2>
				<p className={twAdmin.adminSectionSubtitle}>Listado general de envíos del sistema.</p>
				<div className="mt-3 flex flex-wrap gap-2">
					{[
						{ key: "todos", label: "Todos" },
						{ key: "pendiente", label: "Pendientes" },
						{ key: "despachado", label: "Despachados" },
					].map((item) => (
						<button
							key={item.key}
							onClick={() => setFiltroEstado(item.key as typeof filtroEstado)}
							className={`${twBase.filterBtnBase} ${
								filtroEstado === item.key
									? twBase.filterBtnActive
									: twBase.filterBtnIdle
							}`}
						>
							{item.label}
						</button>
					))}
				</div>
				<div className="mt-3">
					<input
						value={busqueda}
						onChange={(e) => setBusqueda(e.target.value)}
						placeholder="Buscar por #pedido, #envío, estado o dirección..."
						className={`${twBase.searchInput} w-full max-w-[420px]`}
					/>
				</div>
			</div>

			{error && <p className="mt-3 text-red-600">{error}</p>}

			<div className={twBase.tableShell}>
				<div>
					<table className="w-full table-fixed text-left">
						<thead className={twBase.tableHead}>
							<tr>
								<th className="w-[10%] px-4 py-3">Envío</th>
								<th className="w-[10%] px-4 py-3">Pedido</th>
								<th className="w-[18%] px-4 py-3">Estado</th>
								<th className="w-[18%] px-4 py-3">Tipo</th>
								<th className="w-[14%] px-4 py-3">Costo</th>
								<th className="w-[20%] px-4 py-3">Tracking</th>
								<th className="w-[10%] px-4 py-3 text-center">Ver más</th>
							</tr>
						</thead>
						<tbody>
							{enviosFiltrados.length === 0 ? (
								<tr>
									<td colSpan={8} className="px-4 py-8 text-center text-[#64748b]">
										No hay envíos para el filtro seleccionado.
									</td>
								</tr>
							) : (
								enviosFiltrados.map((envio) => {
									const despachado = estaDespachado(envio.estado);
									const expandido = expandidoId === envio.envioId;
									return (
										<Fragment key={envio.envioId}>
											<tr className={twBase.tableRow}>
												<td className="px-4 py-4 font-semibold text-[#001830]">#{envio.envioId}</td>
												<td className="px-4 py-4">#{envio.pedidoId}</td>
												<td className="px-4 py-4">{envio.estado || "—"}</td>
												<td className="px-4 py-4">{envio.tipo || "—"}</td>
												<td className="px-4 py-4 font-semibold text-[#001830]">
													{(envio.costo ?? 0) === 0 ? "Gratis" : formatearMonto(envio.costo)}
												</td>
												<td className="px-4 py-4">
													<span className="block truncate" title={envio.codigoSeguimiento || "—"}>
														{envio.codigoSeguimiento || "—"}
													</span>
												</td>
												<td className="px-4 py-4 text-center">
													<button
														onClick={() => setExpandidoId((prev) => (prev === envio.envioId ? null : envio.envioId))}
														className={`${twBase.iconButton} mx-auto`}
													>
														{expandido ? "−" : "+"}
													</button>
												</td>
											</tr>
											{expandido && (
												<tr className="border-t border-black/10 bg-[#f8fafc]">
													<td colSpan={7} className="px-4 py-4">
														<div className="grid grid-cols-1 gap-3 text-sm text-[#1e1e1e] md:grid-cols-2">
															<p>
																<span className="font-semibold">Dirección de entrega:</span>{" "}
																{envio.direccionEntrega || "—"}
															</p>
															<p>
																<span className="font-semibold">Fecha estimada:</span>{" "}
																{formatearFecha(envio.fechaEstimada)}
															</p>
															<p>
																<span className="font-semibold">Código seguimiento:</span>{" "}
																{envio.codigoSeguimiento || "—"}
															</p>
															<p>
																<span className="font-semibold">Fecha de despacho:</span>{" "}
																{formatearFecha(envio.fechaDespacho)}
															</p>
														</div>
														<div className="mt-3 border-t border-[#dbe4ef] pt-3">
															{despachado ? (
																<span className="text-xs font-semibold text-[#0f766e]">Ya despachado</span>
															) : (
																<>
																	{!puedeGestionar && (
																		<p className={twAdmin.adminHintText}>
																			Modo lectura: este rol no puede despachar envíos.
																		</p>
																	)}
																	<div className="flex max-w-[420px] items-center gap-2">
																		<input
																			value={codigoSeguimientoPorEnvio[envio.envioId] ?? ""}
																			onChange={(e) =>
																				setCodigoSeguimientoPorEnvio((prev) => ({
																					...prev,
																					[envio.envioId]: e.target.value,
																				}))
																			}
																			placeholder="Código seguimiento"
																			className={`${twBase.miniInput} min-w-0 flex-1`}
																		/>
																		<button
																			disabled={!puedeGestionar || procesandoEnvioId === envio.envioId}
																			onClick={() => void despacharEnvio(envio)}
																			className={twBase.actionBtnPrimary}
																		>
																			Despachar
																		</button>
																	</div>
																</>
															)}
														</div>
													</td>
												</tr>
											)}
										</Fragment>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
