import { useState } from "react";
import { AdminSidebar, type AdminSectionKey } from "../components/admin/AdminSidebar";
import { AdminCelularesPanel } from "../components/admin/AdminCelularesPanel";
import { AdminConfiguracionPanel } from "../components/admin/AdminConfiguracionPanel";
import { AdminPedidosPanel } from "../components/admin/AdminPedidosPanel";
import { AdminUsuariosPanel } from "../components/admin/AdminUsuariosPanel";

export const AdminPanel = () => {
	const [seccionActiva, setSeccionActiva] = useState<AdminSectionKey>("reportes");

	return (
		<div className="mx-auto h-[calc(100dvh-72px)] w-full max-w-[1280px] overflow-hidden px-6 py-6">
			<div className="grid h-full min-h-0 grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
				<AdminSidebar seccionActiva={seccionActiva} onSelect={setSeccionActiva} />
				<section className="min-h-0 overflow-hidden rounded-xl border border-black/10 bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
					<div className="h-full min-h-0 overflow-hidden">
						{seccionActiva === "celulares" ? (
							<AdminCelularesPanel />
						) : seccionActiva === "pedidos" ? (
							<AdminPedidosPanel />
						) : seccionActiva === "usuarios" ? (
							<AdminUsuariosPanel />
						) : seccionActiva === "configuracion" ? (
							<AdminConfiguracionPanel />
						) : (
							<div className="rounded-lg border border-[#dbe4ef] bg-[#f6f9fc] p-5">
								<p className="text-[18px] font-semibold text-[#001830]">Reportes</p>
								<p className="mt-1 text-[#5b6673]">
									En el próximo paso conectamos esta sección a los endpoints de reportes.
								</p>
							</div>
						)}
					</div>
				</section>
			</div>
		</div>
	);
};
