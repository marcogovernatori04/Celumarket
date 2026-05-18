import { Fragment, useEffect, useState } from "react";
import { pedidoService, type AdminEnvioItem } from "../../services/pedidoService";

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

export const AdminEnviosPanel = () => {
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
			<div className="rounded-lg border border-[#dbe4ef] bg-[#f6f9fc] p-5">
				<p className="text-[#5b6673]">Cargando envíos...</p>
			</div>
		);
	}

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div>
				<h2 className="text-2xl font-bold text-[#001830]">Envíos</h2>
				<p className="mt-1 text-sm text-[#5b6673]">Listado general de envíos del sistema.</p>
				<div className="mt-3 flex flex-wrap gap-2">
					{[
						{ key: "todos", label: "Todos" },
						{ key: "pendiente", label: "Pendientes" },
						{ key: "despachado", label: "Despachados" },
					].map((item) => (
						<button
							key={item.key}
							onClick={() => setFiltroEstado(item.key as typeof filtroEstado)}
							className={`h-8 rounded-md border px-3 text-xs font-semibold transition-colors ${
								filtroEstado === item.key
									? "border-[#015cb9] bg-[#eef5fd] text-[#015cb9]"
									: "border-[#cdd6e1] bg-white text-[#334155] hover:bg-[#f8fafc]"
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
						className="h-9 w-full max-w-[420px] rounded-md border border-[#cdd6e1] bg-white px-3 text-sm text-[#1e1e1e] placeholder:text-[#94a3b8]"
					/>
				</div>
			</div>

			{error && <p className="mt-3 text-red-600">{error}</p>}

			<div className="mt-6 min-h-0 flex-1 overflow-y-auto rounded-xl border border-black/10 bg-white">
				<div>
					<table className="w-full table-fixed text-left">
						<thead className="bg-[#eef3f8] text-xs font-semibold uppercase tracking-[0.08em] text-[#334155]">
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
											<tr className="border-t border-black/10 text-sm text-[#1e1e1e]">
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
														className="mx-auto flex h-8 w-8 items-center justify-center rounded-md border border-[#cdd6e1] text-lg font-semibold text-[#015cb9] transition-colors hover:bg-[#eef5fd]"
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
																		className="h-8 min-w-0 flex-1 rounded border border-[#cdd6e1] px-2 text-xs"
																	/>
																	<button
																		disabled={procesandoEnvioId === envio.envioId}
																		onClick={() => void despacharEnvio(envio)}
																		className="h-8 rounded bg-[#015cb9] px-3 text-xs font-semibold text-white hover:bg-[#017AF4] disabled:opacity-60"
																	>
																		Despachar
																	</button>
																</div>
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
