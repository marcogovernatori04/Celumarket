import { Fragment, useEffect, useState } from "react";
import { pedidoService, type AdminPedidoDetalle, type AdminPedidoItem } from "../../services/pedidoService";
import { twAdmin, twBase } from "../../styles/tw";

const formatearFecha = (raw?: string) => {
	if (!raw) return "—";
	const d = new Date(raw);
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleDateString("es-AR");
};

const estaFechaVencida = (raw?: string) => {
	if (!raw) return false;
	const d = new Date(raw);
	if (Number.isNaN(d.getTime())) return false;
	return d.getTime() < Date.now();
};

const formatearTipoEnvio = (tipoEnvio?: number) => {
	if (tipoEnvio === 0) return "Domicilio";
	if (tipoEnvio === 1) return "Sucursal correo";
	if (tipoEnvio === 2) return "Retiro local";
	return "—";
};

type AdminPedidosPanelProps = {
	puedeMarcarPagado?: boolean;
	puedeCancelar?: boolean;
	puedeDespachar?: boolean;
	filtroInicial?: "todos" | "pendiente" | "pagado" | "cancelado";
};

export const AdminPedidosPanel = ({
	puedeMarcarPagado = false,
	puedeCancelar = false,
	puedeDespachar = false,
	filtroInicial = "todos",
}: AdminPedidosPanelProps) => {
	const [pedidos, setPedidos] = useState<AdminPedidoItem[]>([]);
	const [filtroEstado, setFiltroEstado] = useState<"todos" | "pendiente" | "pagado" | "cancelado">(filtroInicial);
	const [busqueda, setBusqueda] = useState("");
	const [expandidoId, setExpandidoId] = useState<number | null>(null);
	const [detallePorId, setDetallePorId] = useState<Record<number, AdminPedidoDetalle>>({});
	const [cargandoDetalleId, setCargandoDetalleId] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [procesandoPedidoId, setProcesandoPedidoId] = useState<number | null>(null);
	const [codigoSeguimientoPorPedido, setCodigoSeguimientoPorPedido] = useState<Record<number, string>>({});

	const estaPagado = (estado?: string | null) =>
		(estado ?? "").trim().toLowerCase() === "pagado";
const estaCancelado = (estado?: string | null) =>
	(estado ?? "").trim().toLowerCase() === "cancelado";

const envioYaDespachado = (detalle?: AdminPedidoDetalle | null) =>
	(detalle?.envioEstado ?? "").trim().toLowerCase().includes("despach");

	const busquedaNormalizada = busqueda.trim().toLowerCase();

	const pedidosFiltrados = pedidos.filter((pedido) => {
		if (filtroEstado === "todos") return true;
		const estado = (pedido.estado ?? "").trim().toLowerCase();
		if (filtroEstado === "pendiente") return estado.includes("pendiente");
		if (filtroEstado === "pagado") return estado === "pagado";
		if (filtroEstado === "cancelado") return estado === "cancelado";
		return true;
	}).filter((pedido) => {
		if (!busquedaNormalizada) return true;

		const termino = busquedaNormalizada.startsWith("#")
			? busquedaNormalizada.slice(1)
			: busquedaNormalizada;

		const esSoloDigitos = /^\d+$/.test(termino);
		const idMatch = esSoloDigitos ? String(pedido.id) === termino : false;

		const tokensNombre = (pedido.clienteNombre ?? "")
			.toLowerCase()
			.split(/\s+/)
			.filter(Boolean);
		const nombreMatch = tokensNombre.some((token) => token.startsWith(termino));

		return idMatch || nombreMatch;
	});

	const cargarPedidos = async () => {
		try {
			const data = await pedidoService.obtenerTodosAdmin();
			setPedidos(data);
		} catch {
			setError("No se pudieron cargar los pedidos.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void cargarPedidos();
	}, []);

	useEffect(() => {
		setFiltroEstado(filtroInicial);
	}, [filtroInicial]);

	const toggleDetalle = async (pedidoId: number) => {
		if (expandidoId === pedidoId) {
			setExpandidoId(null);
			return;
		}
		setExpandidoId(pedidoId);
		if (detallePorId[pedidoId]) return;
		try {
			setCargandoDetalleId(pedidoId);
			const detalle = await pedidoService.obtenerDetalleAdmin(pedidoId);
			setDetallePorId((prev) => ({ ...prev, [pedidoId]: detalle }));
		} catch {
			setError("No se pudo cargar el detalle del pedido.");
		} finally {
			setCargandoDetalleId(null);
		}
	};

	const refrescarDetalle = async (pedidoId: number) => {
		const detalle = await pedidoService.obtenerDetalleAdmin(pedidoId);
		setDetallePorId((prev) => ({ ...prev, [pedidoId]: detalle }));
	};

	const marcarPagado = async (pedidoId: number) => {
		try {
			setProcesandoPedidoId(pedidoId);
			setError(null);
			await pedidoService.marcarPagadoAdmin(pedidoId);
			await cargarPedidos();
			await refrescarDetalle(pedidoId);
		} catch {
			setError("No se pudo marcar el pedido como pagado.");
		} finally {
			setProcesandoPedidoId(null);
		}
	};

	const cancelarPedido = async (pedidoId: number) => {
		try {
			setProcesandoPedidoId(pedidoId);
			setError(null);
			await pedidoService.cancelarAdmin(pedidoId);
			await cargarPedidos();
			await refrescarDetalle(pedidoId);
		} catch {
			setError("No se pudo cancelar el pedido.");
		} finally {
			setProcesandoPedidoId(null);
		}
	};

	const despacharPedido = async (pedidoId: number) => {
		const codigo = (codigoSeguimientoPorPedido[pedidoId] ?? "").trim();
		if (!codigo) {
			setError("Ingresá un código de seguimiento para despachar.");
			return;
		}
		try {
			setProcesandoPedidoId(pedidoId);
			setError(null);
			const envios = await pedidoService.listarEnviosAdmin();
			const envioPedido = envios.find((e) => e.pedidoId === pedidoId);
			if (!envioPedido) {
				setError("No se encontró envío asociado a ese pedido.");
				return;
			}
			await pedidoService.despacharEnvioAdmin(envioPedido.envioId, codigo);
			setCodigoSeguimientoPorPedido((prev) => ({ ...prev, [pedidoId]: "" }));
			await cargarPedidos();
			await refrescarDetalle(pedidoId);
		} catch {
			setError("No se pudo despachar el envío.");
		} finally {
			setProcesandoPedidoId(null);
		}
	};

	const puedeMarcarPagadoPedido = (detalle: AdminPedidoDetalle) => {
		const metodo = (detalle.metodoPago ?? "").trim().toLowerCase();
		const esTransferencia = metodo.includes("transferencia");
		const vencido = estaFechaVencida(detalle.fechaVencimiento);
		return esTransferencia && !estaPagado(detalle.estado) && !estaCancelado(detalle.estado) && !vencido;
	};

	const puedeDespacharPedido = (detalle: AdminPedidoDetalle) => estaPagado(detalle.estado) && !envioYaDespachado(detalle);

	if (loading) {
		return (
			<div className={twBase.loadingBox}>
				<p className="text-[#5b6673]">Cargando pedidos...</p>
			</div>
		);
	}

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div>
				<h2 className={twAdmin.adminSectionTitle}>Pedidos</h2>
				<p className={twAdmin.adminSectionSubtitle}>Listado general con detalle expandible por pedido.</p>
				<div className="mt-3 flex flex-wrap gap-2">
					{[
						{ key: "todos", label: "Todos" },
						{ key: "pendiente", label: "Pendientes" },
						{ key: "pagado", label: "Pagados" },
						{ key: "cancelado", label: "Cancelados" },
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
						placeholder="Buscar por #pedido o cliente..."
						className={`${twBase.searchInput} w-full max-w-[360px]`}
					/>
				</div>
			</div>

			{error && <p className="text-red-600">{error}</p>}

			{!error && (
				<div className={twBase.tableShell}>
					<div className="overflow-x-auto">
					<table className="min-w-full text-left">
						<thead className={twBase.tableHead}>
							<tr>
								<th className="px-4 py-3">ID</th>
								<th className="px-4 py-3">Cliente</th>
								<th className="px-4 py-3">Estado</th>
								<th className="px-4 py-3">Fecha</th>
								<th className="px-4 py-3">Envío</th>
								<th className="px-4 py-3">Total</th>
								<th className="px-4 py-3 text-center">Ver más</th>
							</tr>
						</thead>
						<tbody>
							{pedidosFiltrados.length === 0 ? (
								<tr>
									<td colSpan={7} className="px-4 py-6 text-center text-sm text-[#5b6673]">
										No hay pedidos para el filtro seleccionado.
									</td>
								</tr>
							) : (
								pedidosFiltrados.map((pedido) => (
									<Fragment key={pedido.id}>
										<tr key={pedido.id} className={twBase.tableRow}>
											<td className="px-4 py-4 font-semibold text-[#001830]">#{pedido.id}</td>
											<td className="px-4 py-4">{pedido.clienteNombre ?? (pedido.clienteId ? `Cliente #${pedido.clienteId}` : "—")}</td>
											<td className="px-4 py-4">{pedido.estado ?? "—"}</td>
											<td className="px-4 py-4">{formatearFecha(pedido.fecha)}</td>
											<td className="px-4 py-4">{formatearTipoEnvio(pedido.tipoEnvio)}</td>
											<td className="px-4 py-4 font-semibold text-[#001830]">
												${(pedido.montoTotal ?? 0).toLocaleString("es-AR")}
											</td>
											<td className="px-4 py-4 text-center">
												<button
													onClick={() => void toggleDetalle(pedido.id)}
													className={`${twBase.iconButton} mx-auto`}
												>
													{expandidoId === pedido.id ? "−" : "+"}
												</button>
											</td>
										</tr>
										{expandidoId === pedido.id && (
											<tr className="border-t border-black/10 bg-[#f8fafc]">
												<td colSpan={7} className="px-5 py-4">
													{cargandoDetalleId === pedido.id && <p className="text-sm text-[#5b6673]">Cargando detalle...</p>}
													{!cargandoDetalleId && detallePorId[pedido.id] && (
														<div className={twAdmin.adminExpandWrap}>
															<div className={twAdmin.adminExpandMetaGrid}>
																<p><span className="font-semibold">Método de pago:</span> {detallePorId[pedido.id].metodoPago ?? "—"}</p>
																<p><span className="font-semibold">Estado pago:</span> {detallePorId[pedido.id].estadoPago ?? "—"}</p>
																<p><span className="font-semibold">Costo envío:</span> {(detallePorId[pedido.id].costoEnvio ?? 0) === 0 ? "Gratis" : `$${(detallePorId[pedido.id].costoEnvio ?? 0).toLocaleString("es-AR")}`}</p>
																<p><span className="font-semibold">Estado envío:</span> {detallePorId[pedido.id].envioEstado ?? "—"}</p>
																{envioYaDespachado(detallePorId[pedido.id]) && (
																	<>
																		<p><span className="font-semibold">Fecha despacho:</span> {formatearFecha(detallePorId[pedido.id].envioFechaDespacho ?? undefined)}</p>
																		<p><span className="font-semibold">Tracking:</span> {detallePorId[pedido.id].envioCodigoSeguimiento ?? "—"}</p>
																	</>
																)}
																{!estaPagado(detallePorId[pedido.id].estado) && (
																	<p>
																		<span className="font-semibold">Vence:</span>{" "}
																		{estaFechaVencida(detallePorId[pedido.id].fechaVencimiento) ? (
																			<>
																				<span className="line-through">{formatearFecha(detallePorId[pedido.id].fechaVencimiento)}</span>
																				<span className="ml-2 font-semibold text-[#B42318]">Vencido</span>
																			</>
																		) : (
																			formatearFecha(detallePorId[pedido.id].fechaVencimiento)
																		)}
																	</p>
																)}
															</div>
															<div className="flex flex-wrap items-center gap-2 border-t border-[#dbe4ef] pt-3">
																{!puedeMarcarPagado && !puedeCancelar && !puedeDespachar && (
																	<p className={twAdmin.adminHintText}>
																		Modo lectura: este rol no puede modificar pedidos.
																	</p>
																)}
																{detallePorId[pedido.id] && !puedeMarcarPagadoPedido(detallePorId[pedido.id]) && (
																	<p className={twAdmin.adminHintText}>
																		Marcar pagado: solo transferencia pendiente y dentro de plazo.
																	</p>
																)}
																<button
																	disabled={!puedeMarcarPagado || procesandoPedidoId === pedido.id || !detallePorId[pedido.id] || !puedeMarcarPagadoPedido(detallePorId[pedido.id])}
																	onClick={() => void marcarPagado(pedido.id)}
																	className={twBase.actionBtnNeutral}
																>
																	Marcar pagado
																</button>
																<button
																	disabled={!puedeCancelar || procesandoPedidoId === pedido.id || !!detallePorId[pedido.id] && estaPagado(detallePorId[pedido.id].estado)}
																	onClick={() => void cancelarPedido(pedido.id)}
																	className={twBase.actionBtnDanger}
																>
																	Cancelar
																</button>
																{detallePorId[pedido.id] && envioYaDespachado(detallePorId[pedido.id]) ? (
																	<p className={twAdmin.adminHintText}>
																		Este pedido ya fue despachado y no puede volver a despacharse.
																	</p>
																) : (
																	<>
																		<input
																			value={codigoSeguimientoPorPedido[pedido.id] ?? ""}
																			onChange={(e) =>
																				setCodigoSeguimientoPorPedido((prev) => ({ ...prev, [pedido.id]: e.target.value }))
																			}
																			placeholder="Código seguimiento"
																			className={twBase.miniInput}
																		/>
																		<button
																			disabled={
																				!puedeDespachar ||
																				procesandoPedidoId === pedido.id ||
																				!detallePorId[pedido.id] ||
																				!puedeDespacharPedido(detallePorId[pedido.id])
																			}
																			onClick={() => void despacharPedido(pedido.id)}
																			className={twBase.actionBtnPrimary}
																		>
																			Despachar
																		</button>
																		{detallePorId[pedido.id] && !puedeDespacharPedido(detallePorId[pedido.id]) && (
																			<p className={twAdmin.adminHintText}>
																				Despachar: solo disponible cuando el pedido está pagado.
																			</p>
																		)}
																	</>
																)}
															</div>
															<div className="overflow-x-auto rounded-lg border border-[#dbe4ef] bg-white">
																<table className="min-w-full text-left">
																	<thead className="bg-[#eef3f8] text-xs font-semibold uppercase tracking-[0.08em] text-[#334155]">
																		<tr>
																			<th className="px-3 py-2">Equipo</th>
																			<th className="px-3 py-2">Color</th>
																			<th className="px-3 py-2">Cant.</th>
																			<th className="px-3 py-2">Unitario</th>
																			<th className="px-3 py-2">Subtotal</th>
																		</tr>
																	</thead>
																	<tbody>
																		{detallePorId[pedido.id].lineas.map((linea) => (
																			<tr key={linea.id} className="border-t border-black/10 text-sm text-[#1e1e1e]">
																				<td className="px-3 py-2">{linea.marca} {linea.modelo}</td>
																				<td className="px-3 py-2">{linea.color ?? "—"}</td>
																				<td className="px-3 py-2">{linea.cantidad}</td>
																				<td className="px-3 py-2">${linea.precioUnitario.toLocaleString("es-AR")}</td>
																				<td className="px-3 py-2 font-semibold text-[#001830]">${linea.subtotal.toLocaleString("es-AR")}</td>
																			</tr>
																		))}
																	</tbody>
																</table>
															</div>
														</div>
													)}
												</td>
											</tr>
										)}
									</Fragment>
								))
							)}
						</tbody>
					</table>
					</div>
				</div>
			)}
		</div>
	);
};
