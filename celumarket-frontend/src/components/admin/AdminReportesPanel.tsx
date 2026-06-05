import { useCallback, useEffect, useMemo, useState } from "react";
import {
	reportesService,
	type DashboardReporte,
	type FacturacionDiariaReporte,
	type StockCriticoReporte,
	type TopVendidoReporte,
} from "../../services/reportesService";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { AdminSectionKey } from "./AdminSidebar";
import { twAdmin, twBase } from "../../styles/tw";

const formatearMonto = (monto: number) =>
	`$${monto.toLocaleString("es-AR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
const formatearMontoCorto = (monto: number) => {
	if (monto >= 1_000_000) return `$${(monto / 1_000_000).toFixed(1)}M`;
	if (monto >= 1_000) return `$${(monto / 1_000).toFixed(0)}k`;
	return formatearMonto(monto);
};
const formatearFecha = (raw: string) => {
	const d = new Date(raw);
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleDateString("es-AR");
};
const formatearCantidadPedidos = (cantidad: number) =>
	`${cantidad} pedido${cantidad === 1 ? "" : "s"}`;
const hoy = new Date();

type AdminReportesPanelProps = {
	onIrASeccion?: (seccion: AdminSectionKey) => void;
	onIrAPedidosConFiltro?: (filtro: "todos" | "pendiente" | "pagado" | "cancelado") => void;
};

export const AdminReportesPanel = ({ onIrASeccion, onIrAPedidosConFiltro }: AdminReportesPanelProps) => {
	const [dashboard, setDashboard] = useState<DashboardReporte | null>(null);
	const [topVendidos, setTopVendidos] = useState<TopVendidoReporte[]>([]);
	const [stockCritico, setStockCritico] = useState<StockCriticoReporte[]>([]);
	const [facturacion30d, setFacturacion30d] = useState<FacturacionDiariaReporte[]>([]);
	const [facturacionMes, setFacturacionMes] = useState<FacturacionDiariaReporte[]>([]);
	const [umbralStock, setUmbralStock] = useState(5);
	const [anio, setAnio] = useState(hoy.getFullYear());
	const [mes, setMes] = useState(hoy.getMonth() + 1);
	const [loading, setLoading] = useState(true);
	const [recargando, setRecargando] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const cargarTodo = useCallback(async (esRecarga = false) => {
		if (esRecarga) setRecargando(true);
		else setLoading(true);
		setError(null);
		const resultados = await Promise.allSettled([
			reportesService.obtenerDashboard(),
			reportesService.obtenerTopVendidos(),
			reportesService.obtenerStockCritico(umbralStock),
			reportesService.obtenerFacturacion30D(),
			reportesService.obtenerFacturacionMes(anio, mes),
		]);

		let errores = 0;
		if (resultados[0].status === "fulfilled") setDashboard(resultados[0].value); else errores += 1;
		if (resultados[1].status === "fulfilled") setTopVendidos(resultados[1].value); else errores += 1;
		if (resultados[2].status === "fulfilled") setStockCritico(resultados[2].value); else errores += 1;
		if (resultados[3].status === "fulfilled") setFacturacion30d(resultados[3].value); else errores += 1;
		if (resultados[4].status === "fulfilled") setFacturacionMes(resultados[4].value); else errores += 1;
		if (errores > 0) setError(`Algunos reportes no pudieron cargarse (${errores}/5).`);

		if (esRecarga) setRecargando(false);
		else setLoading(false);
	}, [anio, mes, umbralStock]);

	useEffect(() => {
		void cargarTodo();
	}, [cargarTodo]);

	const aplicarFiltros = async () => {
		try {
			setRecargando(true);
			setError(null);
			const [stock, factMesData] = await Promise.all([
				reportesService.obtenerStockCritico(umbralStock),
				reportesService.obtenerFacturacionMes(anio, mes),
			]);
			setStockCritico(stock);
			setFacturacionMes(factMesData);
		} catch {
			setError("No se pudieron aplicar los filtros de reportes.");
		} finally {
			setRecargando(false);
		}
	};

	const resumen30d = useMemo(() => ({
		totalFacturado: facturacion30d.reduce((acc, it) => acc + it.totalFacturado, 0),
		totalProductos: facturacion30d.reduce((acc, it) => acc + it.totalProductos, 0),
		totalEnvio: facturacion30d.reduce((acc, it) => acc + it.totalEnvio, 0),
		totalPedidos: facturacion30d.reduce((acc, it) => acc + it.cantidadPedidos, 0),
	}), [facturacion30d]);
	const resumenMes = useMemo(() => ({
		totalFacturado: facturacionMes.reduce((acc, it) => acc + it.totalFacturado, 0),
		totalProductos: facturacionMes.reduce((acc, it) => acc + it.totalProductos, 0),
		totalEnvio: facturacionMes.reduce((acc, it) => acc + it.totalEnvio, 0),
		totalPedidos: facturacionMes.reduce((acc, it) => acc + it.cantidadPedidos, 0),
	}), [facturacionMes]);
	const serieFacturacion30d = useMemo(
		() =>
			facturacion30d.map((item) => ({
				fecha: formatearFecha(item.fecha),
				totalFacturado: item.totalFacturado,
				totalProductos: item.totalProductos,
				totalEnvio: item.totalEnvio,
			})),
		[facturacion30d],
	);

	if (loading) {
		return (
			<div className={twBase.loadingBox}>
				<p className="text-[#5b6673]">Cargando reportes...</p>
			</div>
		);
	}

	return (
		<div className="flex h-full min-h-0 flex-col overflow-x-hidden">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className={twAdmin.adminSectionTitle}>Reportes</h2>
					<p className={twAdmin.adminSectionSubtitle}>Resumen general con métricas clave del sistema.</p>
				</div>
				<button onClick={() => void cargarTodo(true)} disabled={recargando} className={twAdmin.adminPrimaryBtnSm}>
					{recargando ? "Recargando..." : "Recargar"}
				</button>
			</div>

			{error && <p className="mt-3 text-red-600">{error}</p>}

			<div className="mt-3 min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
				<div className="w-full">
				<div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
					<KpiCard titulo="Recaudación productos" valor={formatearMonto(dashboard?.recaudacionProductos ?? 0)} />
					<KpiCard titulo="Cobrado por envíos" valor={formatearMonto(dashboard?.recaudacionEnvios ?? 0)} />
					<KpiCard titulo="Recaudación bruta" valor={formatearMonto(dashboard?.recaudacionTotal ?? 0)} />
				</div>
				<div className="my-2.5 h-px w-full bg-[#d9e1ea]" />
				<div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
					<KpiCard titulo="Clientes" valor={dashboard?.totalClientes ?? 0} onClick={() => onIrASeccion?.("usuarios")} />
					<KpiCard titulo="Pedidos pendientes" valor={dashboard?.pedidosPendientes ?? 0} onClick={() => onIrAPedidosConFiltro?.("pendiente")} />
					<KpiCard titulo="Productos sin stock" valor={dashboard?.productosSinStock ?? 0} onClick={() => onIrASeccion?.("celulares")} />
					<KpiCard titulo="Total pedidos" valor={dashboard?.totalPedidos ?? 0} onClick={() => onIrAPedidosConFiltro?.("todos")} />
				</div>

				<div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-2">
					<div className="min-w-0">
						<FacturacionCard
							titulo="Facturación últimos 30 días"
							resumen={`Pedidos: ${resumen30d.totalPedidos} · Productos: ${formatearMonto(resumen30d.totalProductos)} · Envío: ${formatearMonto(resumen30d.totalEnvio)} · Total: ${formatearMonto(resumen30d.totalFacturado)}`}
							items={facturacion30d}
							serie={serieFacturacion30d}
						/>
					</div>
					<div className="min-w-0 space-y-3">
						<div className={twBase.panel}>
							<div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 bg-[#eef3f8] px-4 py-3">
								<div>
									<h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#334155]">Facturación por mes</h3>
									<p className="text-xs text-[#5b6673]">Pedidos: {resumenMes.totalPedidos} · Productos: {formatearMonto(resumenMes.totalProductos)} · Envío: {formatearMonto(resumenMes.totalEnvio)} · Total: {formatearMonto(resumenMes.totalFacturado)}</p>
								</div>
								<div className="flex flex-wrap items-center gap-2">
									<input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} className={`${twBase.miniInput} w-24`} />
									<input type="number" min={1} max={12} value={mes} onChange={(e) => setMes(Number(e.target.value))} className={`${twBase.miniInput} w-16`} />
									<button onClick={() => void aplicarFiltros()} disabled={recargando} className={twBase.applyBtn}>Aplicar</button>
								</div>
							</div>
							<div className="max-h-[180px] overflow-y-auto overflow-x-hidden divide-y divide-black/10">
								{facturacionMes.length === 0 ? (
									<p className="px-4 py-8 text-center text-[#64748b]">Sin facturación para ese período.</p>
								) : (
									facturacionMes.map((item, idx) => (
										<div key={`${item.fecha}-${idx}`} className={twBase.listRow3}>
											<p className="font-semibold text-[#001830]">{formatearFecha(item.fecha)}</p>
											<p className="text-[#334155]">{formatearCantidadPedidos(item.cantidadPedidos)}</p>
											<p className="justify-self-end font-semibold text-[#001830]">{formatearMonto(item.totalFacturado)}</p>
										</div>
									))
								)}
							</div>
						</div>

						<section className={twBase.panel}>
						<div className={twBase.panelHeader}>
							<h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#334155]">Top 5 vendidos</h3>
						</div>
						<div className="min-w-0 divide-y divide-black/10">
							{topVendidos.length === 0 ? (
								<p className="px-4 py-8 text-center text-[#64748b]">Sin ventas pagadas todavía.</p>
							) : (
								topVendidos.map((item, idx) => (
									<div key={`${item.marca}-${item.modelo}-${idx}`} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3 text-sm">
										<p className="min-w-0 break-words font-semibold text-[#001830]">{item.marca} {item.modelo}</p>
										<p className="text-[#334155]">{item.cantidadVendida} u.</p>
										<p className="font-semibold text-[#001830]">{formatearMonto(item.totalRecaudado)}</p>
									</div>
								))
							)}
						</div>
						</section>

						<section className={twBase.panel}>
						<div className="flex flex-col gap-3 border-b border-black/10 bg-[#eef3f8] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
							<h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#334155]">Stock crítico</h3>
							<div className="flex flex-wrap items-center gap-2">
								<label className="text-xs font-medium text-[#334155]">Umbral</label>
								<input type="number" min={0} value={umbralStock} onChange={(e) => setUmbralStock(Number(e.target.value))} className={`${twBase.miniInput} w-20`} />
								<button onClick={() => void aplicarFiltros()} disabled={recargando} className={twBase.applyBtn}>Aplicar</button>
							</div>
						</div>
						<div className="min-w-0 divide-y divide-black/10">
							{stockCritico.length === 0 ? (
								<p className="px-4 py-8 text-center text-[#64748b]">No hay variaciones bajo el umbral.</p>
							) : (
								stockCritico.map((item) => (
									<div key={item.variacionId} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3 text-sm">
										<p className="min-w-0 break-words font-semibold text-[#001830]">{item.marcaModelo}</p>
										<p className="text-[#334155]">Stock: {item.stockActual}</p>
										<p className="font-semibold text-[#001830]">{formatearMonto(item.precio)}</p>
									</div>
								))
							)}
						</div>
						</section>
					</div>
				</div>
				</div>
			</div>
		</div>
	);
};

const KpiCard = ({ titulo, valor, onClick }: { titulo: string; valor: number | string; onClick?: () => void }) => (
	<div
		role={onClick ? "button" : undefined}
		tabIndex={onClick ? 0 : undefined}
		onClick={onClick}
		onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
		className={`min-w-0 rounded-xl border px-3 py-2 ${
			onClick
				? "cursor-pointer border-[#9fc5ef] bg-[#f3f8ff] shadow-sm ring-1 ring-[#dbeafe] transition-colors hover:border-[#015cb9] hover:bg-[#eaf4ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#015cb9]"
				: "border-black/10 bg-white"
		}`}
	>
		<div className="flex items-start justify-between gap-2">
			<p className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${onClick ? "text-[#015cb9]" : "text-[#64748b]"}`}>{titulo}</p>
			{onClick && (
				<span aria-hidden="true" className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#015cb9] text-sm font-bold leading-none text-white">
					›
				</span>
			)}
		</div>
		<p className="mt-0.5 break-words text-[clamp(0.95rem,1.4vw,1.25rem)] font-bold leading-tight text-[#001830]">{valor}</p>
	</div>
);

const FacturacionCard = ({
	titulo,
	resumen,
	items,
	serie,
}: {
	titulo: string;
	resumen: string;
	items: FacturacionDiariaReporte[];
	serie: Array<{
		fecha: string;
		totalFacturado: number;
		totalProductos: number;
		totalEnvio: number;
	}>;
}) => (
	<div className="min-w-0 rounded-xl border border-black/10 bg-white">
		<div className="border-b border-black/10 bg-[#eef3f8] px-3 py-2">
			<h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#334155]">{titulo}</h3>
			<p className="text-xs text-[#5b6673]">{resumen}</p>
		</div>
		<div className="border-b border-black/10 bg-white px-2 py-1.5">
			<ResponsiveContainer width="100%" height={280} minWidth={280} minHeight={220}>
				<LineChart data={serie} margin={{ top: 6, right: 6, left: 2, bottom: 0 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="#e6edf5" />
					<XAxis dataKey="fecha" tick={{ fill: "#5b6673", fontSize: 9 }} />
					<YAxis tickFormatter={formatearMontoCorto} tick={{ fill: "#5b6673", fontSize: 9 }} />
					<Tooltip
						formatter={(value) => formatearMonto(Number(value ?? 0))}
						contentStyle={{ borderRadius: 10, border: "1px solid #dbe4ef" }}
					/>
					<Legend wrapperStyle={{ fontSize: "10px" }} />
					<Line type="monotone" dataKey="totalFacturado" name="Total facturado" stroke="#015cb9" strokeWidth={2.2} dot={false} />
					<Line type="monotone" dataKey="totalProductos" name="Total productos" stroke="#1e8e5a" strokeWidth={2} dot={false} />
					<Line type="monotone" dataKey="totalEnvio" name="Total envío" stroke="#f59e0b" strokeWidth={2} dot={false} />
				</LineChart>
			</ResponsiveContainer>
		</div>
		<div className="max-h-[110px] overflow-y-auto overflow-x-hidden divide-y divide-black/10">
			{items.length === 0 ? (
				<p className="px-4 py-8 text-center text-[#64748b]">Sin datos para mostrar.</p>
			) : (
				items.map((item, idx) => (
					<div key={`${item.fecha}-${idx}`} className={twBase.listRow3}>
						<p className="font-semibold text-[#001830]">{formatearFecha(item.fecha)}</p>
						<p className="text-[#334155]">{formatearCantidadPedidos(item.cantidadPedidos)}</p>
						<p className="justify-self-end font-semibold text-[#001830]">{formatearMonto(item.totalFacturado)}</p>
					</div>
				))
			)}
		</div>
	</div>
);
