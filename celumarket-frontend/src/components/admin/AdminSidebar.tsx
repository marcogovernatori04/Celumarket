import { useEffect, useRef } from "react";

type AdminSectionKey =
	| "reportes"
	| "celulares"
	| "envios"
	| "pedidos"
	| "usuarios"
	| "usuarios-internos"
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
	{ key: "usuarios-internos", label: "Usuarios internos" },
	{ key: "configuracion", label: "Configuración" },
];

export const AdminSidebar = ({ seccionActiva, rol, onSelect }: AdminSidebarProps) => {
	const navRef = useRef<HTMLElement | null>(null);
	const activeButtonRef = useRef<HTMLButtonElement | null>(null);
	const esAdmin = rol === "Admin";
	const esVentas = rol === "Ventas";
	const esSoporte = rol === "Soporte";
	const seccionesVisibles = sections.filter((section) => {
		if (esAdmin) return true;
		if (esVentas) return section.key === "reportes" || section.key === "pedidos" || section.key === "envios";
		if (esSoporte) return section.key === "pedidos" || section.key === "envios" || section.key === "usuarios";
		return false;
	});
	const desplazar = (direccion: -1 | 1) => {
		navRef.current?.scrollBy({ left: direccion * 150, behavior: "smooth" });
	};

	useEffect(() => {
		if (window.innerWidth >= 1024) return;
		activeButtonRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "center",
		});
	}, [seccionActiva]);

	return (
		<aside className="w-full rounded-xl border border-black/10 bg-white p-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.06)] lg:max-w-[196px]">
			<p className="px-2.5 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
				Panel ABM
			</p>
			<div className="grid grid-cols-[32px_minmax(0,1fr)_32px] items-center gap-1 lg:block">
				<button
					type="button"
					onClick={() => desplazar(-1)}
					className="flex h-8 w-8 items-center justify-center rounded-md border border-[#d6dde7] bg-white text-lg leading-none text-[#001830] shadow-sm hover:bg-[#eef3f8] lg:hidden"
					aria-label="Ver secciones anteriores"
				>
					‹
				</button>
				<nav ref={navRef} className="flex gap-2 overflow-x-auto scroll-smooth pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
					{seccionesVisibles.map((section) => {
						const active = section.key === seccionActiva;
						return (
							<button
								key={section.key}
								ref={active ? activeButtonRef : undefined}
								onClick={() => onSelect?.(section.key)}
								className={`flex shrink-0 items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors lg:w-full lg:px-2.5 ${
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
				<button
					type="button"
					onClick={() => desplazar(1)}
					className="flex h-8 w-8 items-center justify-center rounded-md border border-[#d6dde7] bg-white text-lg leading-none text-[#001830] shadow-sm hover:bg-[#eef3f8] lg:hidden"
					aria-label="Ver más secciones"
				>
					›
				</button>
			</div>
		</aside>
	);
};

export type { AdminSectionKey };
