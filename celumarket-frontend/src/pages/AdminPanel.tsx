import { useState } from "react";
import { AdminSidebar, type AdminSectionKey } from "../components/admin/AdminSidebar";
import { AdminCelularesPanel } from "../components/admin/AdminCelularesPanel";
import { AdminConfiguracionPanel } from "../components/admin/AdminConfiguracionPanel";
import { AdminUsuariosPanel } from "../components/admin/AdminUsuariosPanel";

export const AdminPanel = () => {
	const [seccionActiva, setSeccionActiva] = useState<AdminSectionKey>("reportes");
	const seccionActivaLabel = seccionActiva.charAt(0).toUpperCase() + seccionActiva.slice(1);

	return (
		<div className="mx-auto w-full max-w-[1280px] px-6 py-8">
			<div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
				<AdminSidebar seccionActiva={seccionActiva} onSelect={setSeccionActiva} />
				<section className="rounded-xl border border-black/10 bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
					<h1 className="text-3xl font-extrabold text-[#001830]">Panel Admin</h1>
					<p className="mt-1 text-[16px] text-[#5b6673]">
						Sección activa: <span className="font-semibold text-[#001830]">{seccionActivaLabel}</span>
					</p>
					<div className="mt-6">
						{seccionActiva === "celulares" ? (
							<AdminCelularesPanel />
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
