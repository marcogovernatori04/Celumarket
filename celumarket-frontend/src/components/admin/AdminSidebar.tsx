type AdminSectionKey =
	| "reportes"
	| "celulares"
	| "envios"
	| "pedidos"
	| "usuarios"
	| "configuracion";

type AdminSidebarProps = {
	seccionActiva: AdminSectionKey;
	onSelect?: (section: AdminSectionKey) => void;
};

const sections: Array<{ key: AdminSectionKey; label: string }> = [
	{ key: "reportes", label: "Reportes" },
	{ key: "celulares", label: "Celulares" },
	{ key: "envios", label: "Envíos" },
	{ key: "pedidos", label: "Pedidos" },
	{ key: "usuarios", label: "Usuarios" },
	{ key: "configuracion", label: "Configuración" },
];

export const AdminSidebar = ({ seccionActiva, onSelect }: AdminSidebarProps) => {
	return (
		<aside className="w-full max-w-[260px] rounded-xl border border-black/10 bg-white p-3 shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
			<p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
				Panel ABM
			</p>
			<nav className="space-y-1">
				{sections.map((section) => {
					const active = section.key === seccionActiva;
					return (
						<button
							key={section.key}
							onClick={() => onSelect?.(section.key)}
							className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-[15px] font-medium transition-colors ${
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
