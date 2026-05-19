import { useEffect, useMemo, useState } from "react";
import {
	reportesService,
	type DashboardReporte,
	type FacturacionDiariaReporte,
	type StockCriticoReporte,
	type TopVendidoReporte,
} from "../../services/reportesService";
import type { AdminSectionKey } from "./AdminSidebar";
import { twAdmin, twBase } from "../../styles/tw";

const formatearMonto = (monto: number) => `$${monto.toLocaleString("es-AR")}`;
const formatearFecha = (raw: string) => {
	const d = new Date(raw);
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleDateString("es-AR");
};
const hoy = new Date();

type AdminReportesPanelProps = {
	onIrASeccion?: (seccion: AdminSectionKey) => void;
};

export const AdminReportesPanel = ({ onIrASeccion }: AdminReportesPanelProps) => {
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

	const cargarTodo = async (esRecarga = false) => {
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
	};

	useEffect(() => {
		void cargarTodo();
	}, []);

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

	if (loading) {
		return (
			<div className={twBase.loadingBox}>
				<p className="text-[#5b6673]">Cargando reportes...</p>
			</div>
		);
	}

	return (
		<div className="flex h-full min-h-0 flex-col overflow-x-hidden">
			<div className="flex items-center justify-between gap-3">
				<div>
					<h2 className={twAdmin.adminSectionTitle}>Reportes</h2>
					<p className={twAdmin.adminSectionSubtitle}>Resumen general con métricas clave del sistema.</p>
				</div>
				<button onClick={() => void cargarTodo(true)} disabled={recargando} className={twAdmin.adminPrimaryBtnSm}>
					{recargando ? "Recargando..." : "Recargar"}
				</button>
			</div>

			{error && <p className="mt-3 text-red-600">{error}</p>}

			<div className="mt-5 min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
					<KpiCard titulo="Clientes" valor={dashboard?.totalClientes ?? 0} onClick={() => onIrASeccion?.("usuarios")} />
					<KpiCard titulo="Pedidos pendientes" valor={dashboard?.pedidosPendientes ?? 0} onClick={() => onIrASeccion?.("pedidos")} />
					<KpiCard titulo="Productos sin stock" valor={dashboard?.productosSinStock ?? 0} onClick={() => onIrASeccion?.("celulares")} />
					<KpiCard titulo="Total pedidos" valor={dashboard?.totalPedidos ?? 0} onClick={() => onIrASeccion?.("pedidos")} />
					<KpiCard titulo="Recaudación productos" valor={formatearMonto(dashboard?.recaudacionProductos ?? 0)} />
					<KpiCard titulo="Cobrado por envíos" valor={formatearMonto(dashboard?.recaudacionEnvios ?? 0)} />
					<KpiCard titulo="Recaudación bruta" valor={formatearMonto(dashboard?.recaudacionTotal ?? 0)} />
				</div>

				<div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
					<FacturacionCard
						titulo="Facturación últimos 30 días"
						resumen={`Pedidos: ${resumen30d.totalPedidos} · Productos: ${formatearMonto(resumen30d.totalProductos)} · Envío: ${formatearMonto(resumen30d.totalEnvio)} · Total: ${formatearMonto(resumen30d.totalFacturado)}`}
						items={facturacion30d}
					/>
					<div className={twBase.panel}>
						<div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 bg-[#eef3f8] px-4 py-3">
							<div>
								<h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#334155]">Facturación por mes</h3>
								<p className="text-xs text-[#5b6673]">Pedidos: {resumenMes.totalPedidos} · Productos: {formatearMonto(resumenMes.totalProductos)} · Envío: {formatearMonto(resumenMes.totalEnvio)} · Total: {formatearMonto(resumenMes.totalFacturado)}</p>
							</div>
							<div className="flex items-center gap-2">
								<input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} className={`${twBase.miniInput} w-24`} />
								<input type="number" min={1} max={12} value={mes} onChange={(e) => setMes(Number(e.target.value))} className={`${twBase.miniInput} w-16`} />
								<button onClick={() => void aplicarFiltros()} disabled={recargando} className={twBase.applyBtn}>Aplicar</button>
							</div>
						</div>
						<div className={twBase.scrollArea}>
							{facturacionMes.length === 0 ? (
								<p className="px-4 py-8 text-center text-[#64748b]">Sin facturación para ese período.</p>
							) : (
								facturacionMes.map((item, idx) => (
									<div key={`${item.fecha}-${idx}`} className={twBase.listRow3}>
										<p className="font-semibold text-[#001830]">{formatearFecha(item.fecha)}</p>
										<p className="text-[#334155]">{item.cantidadPedidos} pedidos</p>
										<p className="justify-self-end font-semibold text-[#001830]">{formatearMonto(item.totalFacturado)}</p>
									</div>
								))
							)}
						</div>
					</div>
				</div>

				<div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
					<section className={twBase.panel}>
						<div className={twBase.panelHeader}>
							<h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#334155]">Top 5 vendidos</h3>
						</div>
						<div className={`min-w-0 ${twBase.rowDivider}`}>
							{topVendidos.length === 0 ? (
								<p className="px-4 py-8 text-center text-[#64748b]">Sin ventas pagadas todavía.</p>
							) : (
								topVendidos.map((item, idx) => (
									<div key={`${item.marca}-${item.modelo}-${idx}`} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 text-sm">
										<p className="font-semibold text-[#001830]">{item.marca} {item.modelo}</p>
										<p className="text-[#334155]">{item.cantidadVendida} u.</p>
										<p className="font-semibold text-[#001830]">{formatearMonto(item.totalRecaudado)}</p>
									</div>
								))
							)}
						</div>
					</section>

					<section className={twBase.panel}>
						<div className="flex items-center justify-between gap-3 border-b border-black/10 bg-[#eef3f8] px-4 py-3">
							<h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#334155]">Stock crítico</h3>
							<div className="flex items-center gap-2">
								<label className="text-xs font-medium text-[#334155]">Umbral</label>
								<input type="number" min={0} value={umbralStock} onChange={(e) => setUmbralStock(Number(e.target.value))} className={`${twBase.miniInput} w-20`} />
								<button onClick={() => void aplicarFiltros()} disabled={recargando} className={twBase.applyBtn}>Aplicar</button>
							</div>
						</div>
						<div className={twBase.scrollArea}>
							{stockCritico.length === 0 ? (
								<p className="px-4 py-8 text-center text-[#64748b]">No hay variaciones bajo el umbral.</p>
							) : (
								stockCritico.map((item) => (
									<div key={item.variacionId} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 text-sm">
										<p className="font-semibold text-[#001830]">{item.marcaModelo}</p>
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
	);
};

const KpiCard = ({ titulo, valor, onClick }: { titulo: string; valor: number | string; onClick?: () => void }) => (
	<div
		role={onClick ? "button" : undefined}
		tabIndex={onClick ? 0 : undefined}
		onClick={onClick}
		onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
		className={`min-w-0 rounded-xl border border-black/10 bg-white px-4 py-3 ${onClick ? "cursor-pointer transition-colors hover:bg-[#f8fbff]" : ""}`}
	>
		<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">{titulo}</p>
		<p className="mt-1 break-words text-[clamp(1.1rem,2vw,1.75rem)] font-bold leading-tight text-[#001830]">{valor}</p>
	</div>
);

const FacturacionCard = ({
	titulo,
	resumen,
	items,
}: {
	titulo: string;
	resumen: string;
	items: FacturacionDiariaReporte[];
}) => (
	<div className="min-w-0 rounded-xl border border-black/10 bg-white">
		<div className="border-b border-black/10 bg-[#eef3f8] px-4 py-3">
			<h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#334155]">{titulo}</h3>
			<p className="text-xs text-[#5b6673]">{resumen}</p>
		</div>
		<div className="max-h-[300px] overflow-y-auto overflow-x-hidden divide-y divide-black/10">
			{items.length === 0 ? (
				<p className="px-4 py-8 text-center text-[#64748b]">Sin datos para mostrar.</p>
			) : (
				items.map((item, idx) => (
					<div key={`${item.fecha}-${idx}`} className={twBase.listRow3}>
						<p className="font-semibold text-[#001830]">{formatearFecha(item.fecha)}</p>
						<p className="text-[#334155]">{item.cantidadPedidos} pedidos</p>
						<p className="justify-self-end font-semibold text-[#001830]">{formatearMonto(item.totalFacturado)}</p>
					</div>
				))
			)}
		</div>
	</div>
);
