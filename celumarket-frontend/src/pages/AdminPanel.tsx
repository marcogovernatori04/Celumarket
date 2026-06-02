import { lazy, Suspense, useEffect, useState } from "react";
import { AdminSidebar, type AdminSectionKey } from "../components/admin/AdminSidebar";
import { twLayout } from "../styles/tw";

const AdminCelularesPanel = lazy(() => import("../components/admin/AdminCelularesPanel").then(({ AdminCelularesPanel }) => ({ default: AdminCelularesPanel })));
const AdminConfiguracionPanel = lazy(() => import("../components/admin/AdminConfiguracionPanel").then(({ AdminConfiguracionPanel }) => ({ default: AdminConfiguracionPanel })));
const AdminEnviosPanel = lazy(() => import("../components/admin/AdminEnviosPanel").then(({ AdminEnviosPanel }) => ({ default: AdminEnviosPanel })));
const AdminPedidosPanel = lazy(() => import("../components/admin/AdminPedidosPanel").then(({ AdminPedidosPanel }) => ({ default: AdminPedidosPanel })));
const AdminReportesPanel = lazy(() => import("../components/admin/AdminReportesPanel").then(({ AdminReportesPanel }) => ({ default: AdminReportesPanel })));
const AdminUsuariosInternosPanel = lazy(() => import("../components/admin/AdminUsuariosInternosPanel").then(({ AdminUsuariosInternosPanel }) => ({ default: AdminUsuariosInternosPanel })));
const AdminUsuariosPanel = lazy(() => import("../components/admin/AdminUsuariosPanel").then(({ AdminUsuariosPanel }) => ({ default: AdminUsuariosPanel })));

type AdminPanelProps = {
	rol?: string | null;
};

const esSeccionPermitida = (seccion: AdminSectionKey, rol?: string | null) => {
	if (rol === "Admin") return true;
	if (rol === "Ventas") return seccion === "reportes" || seccion === "pedidos" || seccion === "envios";
	if (rol === "Soporte") return seccion === "pedidos" || seccion === "envios" || seccion === "usuarios";
	return false;
};

export const AdminPanel = ({ rol }: AdminPanelProps) => {
	const seccionInicial: AdminSectionKey =
		rol === "Soporte" ? "pedidos" : "reportes";
	const [seccionActiva, setSeccionActiva] = useState<AdminSectionKey>(seccionInicial);
	const [filtroPedidos, setFiltroPedidos] = useState<"todos" | "pendiente" | "pagado" | "cancelado">("todos");
	const [pedidoEnvioEnFoco, setPedidoEnvioEnFoco] = useState<number | null>(null);

	const setSeccionSegura = (seccion: AdminSectionKey) => {
		if (esSeccionPermitida(seccion, rol)) setSeccionActiva(seccion);
	};

	const irAPedidosConFiltro = (filtro: "todos" | "pendiente" | "pagado" | "cancelado") => {
		if (!esSeccionPermitida("pedidos", rol)) return;
		setFiltroPedidos(filtro);
		setSeccionActiva("pedidos");
	};

	const irAEnvioDePedido = (pedidoId: number) => {
		if (!esSeccionPermitida("envios", rol)) return;
		setPedidoEnvioEnFoco(pedidoId);
		setSeccionActiva("envios");
	};

	const puedeMarcarPagadoPedidos = rol === "Admin" || rol === "Soporte";
	const puedeCancelarPedidos = rol === "Admin";
	const puedeDespacharDesdePedidos = rol === "Admin";
	const puedeGestionarEnvios = rol === "Admin" || rol === "Soporte";

	useEffect(() => {
		if (!esSeccionPermitida(seccionActiva, rol)) {
			setSeccionActiva(rol === "Soporte" ? "pedidos" : "reportes");
		}
	}, [rol, seccionActiva]);

	return (
		<div className={twLayout.adminShell}>
			<div className="grid min-h-0 grid-cols-1 gap-4 lg:h-full lg:grid-cols-[196px_minmax(0,1fr)]">
				<AdminSidebar rol={rol} seccionActiva={seccionActiva} onSelect={setSeccionSegura} />
				<section className={twLayout.adminContentCard}>
					<div className={`min-h-0 lg:h-full ${seccionActiva === "configuracion" ? "lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1" : "lg:overflow-hidden"}`}>
						<Suspense fallback={<AdminPanelFallback />}>
						{seccionActiva === "celulares" ? (
							<AdminCelularesPanel />
						) : seccionActiva === "envios" ? (
							<AdminEnviosPanel puedeGestionar={puedeGestionarEnvios} pedidoIdEnFoco={pedidoEnvioEnFoco} />
						) : seccionActiva === "pedidos" ? (
							<AdminPedidosPanel
								puedeMarcarPagado={puedeMarcarPagadoPedidos}
								puedeCancelar={puedeCancelarPedidos}
								puedeDespachar={puedeDespacharDesdePedidos}
								filtroInicial={filtroPedidos}
								onVerEnvioPedido={irAEnvioDePedido}
							/>
						) : seccionActiva === "usuarios" ? (
							<AdminUsuariosPanel />
						) : seccionActiva === "usuarios-internos" ? (
							<AdminUsuariosInternosPanel />
						) : seccionActiva === "configuracion" ? (
							<AdminConfiguracionPanel />
						) : (
							<AdminReportesPanel onIrASeccion={setSeccionSegura} onIrAPedidosConFiltro={irAPedidosConFiltro} />
						)}
						</Suspense>
					</div>
				</section>
			</div>
		</div>
	);
};

function AdminPanelFallback() {
	return (
		<div className="rounded-lg border border-[#dbe4ef] bg-[#f6f9fc] p-5 text-sm font-medium text-[#475569]">
			Cargando panel...
		</div>
	);
}
