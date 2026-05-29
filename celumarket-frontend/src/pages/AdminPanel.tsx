import { useEffect, useState } from "react";
import { AdminSidebar, type AdminSectionKey } from "../components/admin/AdminSidebar";
import { AdminCelularesPanel } from "../components/admin/AdminCelularesPanel";
import { AdminConfiguracionPanel } from "../components/admin/AdminConfiguracionPanel";
import { AdminEnviosPanel } from "../components/admin/AdminEnviosPanel";
import { AdminPedidosPanel } from "../components/admin/AdminPedidosPanel";
import { AdminReportesPanel } from "../components/admin/AdminReportesPanel";
import { AdminUsuariosPanel } from "../components/admin/AdminUsuariosPanel";
import { twLayout } from "../styles/tw";

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

	const setSeccionSegura = (seccion: AdminSectionKey) => {
		if (esSeccionPermitida(seccion, rol)) setSeccionActiva(seccion);
	};

	const irAPedidosConFiltro = (filtro: "todos" | "pendiente" | "pagado" | "cancelado") => {
		if (!esSeccionPermitida("pedidos", rol)) return;
		setFiltroPedidos(filtro);
		setSeccionActiva("pedidos");
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
					<div className="min-h-0 lg:h-full lg:overflow-hidden">
						{seccionActiva === "celulares" ? (
							<AdminCelularesPanel />
						) : seccionActiva === "envios" ? (
							<AdminEnviosPanel puedeGestionar={puedeGestionarEnvios} />
						) : seccionActiva === "pedidos" ? (
							<AdminPedidosPanel
								puedeMarcarPagado={puedeMarcarPagadoPedidos}
								puedeCancelar={puedeCancelarPedidos}
								puedeDespachar={puedeDespacharDesdePedidos}
								filtroInicial={filtroPedidos}
							/>
						) : seccionActiva === "usuarios" ? (
							<AdminUsuariosPanel />
						) : seccionActiva === "configuracion" ? (
							<AdminConfiguracionPanel />
						) : (
							<AdminReportesPanel onIrASeccion={setSeccionSegura} onIrAPedidosConFiltro={irAPedidosConFiltro} />
						)}
					</div>
				</section>
			</div>
		</div>
	);
};
