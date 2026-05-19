import { useState } from "react";
import { AdminSidebar, type AdminSectionKey } from "../components/admin/AdminSidebar";
import { AdminCelularesPanel } from "../components/admin/AdminCelularesPanel";
import { AdminConfiguracionPanel } from "../components/admin/AdminConfiguracionPanel";
import { AdminEnviosPanel } from "../components/admin/AdminEnviosPanel";
import { AdminPedidosPanel } from "../components/admin/AdminPedidosPanel";
import { AdminReportesPanel } from "../components/admin/AdminReportesPanel";
import { AdminUsuariosPanel } from "../components/admin/AdminUsuariosPanel";
import { twLayout } from "../styles/tw";

export const AdminPanel = () => {
	const [seccionActiva, setSeccionActiva] = useState<AdminSectionKey>("reportes");

	return (
		<div className={twLayout.adminShell}>
			<div className="grid h-full min-h-0 grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
				<AdminSidebar seccionActiva={seccionActiva} onSelect={setSeccionActiva} />
				<section className={twLayout.adminContentCard}>
					<div className="h-full min-h-0 overflow-hidden">
						{seccionActiva === "celulares" ? (
							<AdminCelularesPanel />
						) : seccionActiva === "envios" ? (
							<AdminEnviosPanel />
						) : seccionActiva === "pedidos" ? (
							<AdminPedidosPanel />
						) : seccionActiva === "usuarios" ? (
							<AdminUsuariosPanel />
						) : seccionActiva === "configuracion" ? (
							<AdminConfiguracionPanel />
						) : (
							<AdminReportesPanel onIrASeccion={setSeccionActiva} />
						)}
					</div>
				</section>
			</div>
		</div>
	);
};
