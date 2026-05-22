type AdminSectionKey =
	| "reportes"
	| "celulares"
	| "envios"
	| "pedidos"
	| "usuarios"
	| "configuracion";

type AdminSidebarProps = {
	seccionActiva: AdminSectionKey;
	rol?: string | null;
	onSelect?: (section: AdminSectionKey) => void;
};

const sections: Array<{ key: AdminSectionKey; label: string }> = [
	{ key: "reportes", label: "Reportes" },
	{ key: "celulares", label: "Celulares" },
	{ key: "envios", label: "Envíos" },
	{ key: "pedidos", label: "Pedidos" },
	{ key: "usuarios", label: "Clientes" },
	{ key: "configuracion", label: "Configuración" },
];

export const AdminSidebar = ({ seccionActiva, rol, onSelect }: AdminSidebarProps) => {
	const esAdmin = rol === "Admin";
	const esVentas = rol === "Ventas";
	const esSoporte = rol === "Soporte";
	const seccionesVisibles = sections.filter((section) => {
		if (esAdmin) return true;
		if (esVentas) return section.key === "reportes" || section.key === "pedidos" || section.key === "envios";
		if (esSoporte) return section.key === "pedidos" || section.key === "envios" || section.key === "usuarios";
		return false;
	});

	return (
		<aside className="w-full max-w-[196px] rounded-xl border border-black/10 bg-white p-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
			<p className="px-2.5 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
				Panel ABM
			</p>
			<nav className="space-y-1">
				{seccionesVisibles.map((section) => {
					const active = section.key === seccionActiva;
					return (
						<button
							key={section.key}
							onClick={() => onSelect?.(section.key)}
							className={`flex w-full items-center rounded-lg px-2.5 py-2.5 text-left text-sm font-medium transition-colors ${
								active
									? "bg-[#015cb9] text-white"
									: "text-[#001830] hover:bg-[#eef3f8]"
							}`}
						>
							{section.label}
						</button>
					);
				})}
			</nav>
		</aside>
	);
};

export type { AdminSectionKey };
