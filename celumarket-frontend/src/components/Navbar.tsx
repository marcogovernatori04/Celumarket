import { useEffect, useRef, useState } from "react";

type NavbarProps = {
	onIrATienda?: () => void;
	onIrAInicio?: () => void;
	onIrACarrito?: () => void;
	onIrALogin?: () => void;
	onLogout?: () => void;
	enTienda?: boolean;
	estaLogueado?: boolean;
	nombreCliente?: string | null;
	onCambiarClave?: () => void;
	onVerPerfil?: () => void;
	onVerMisPedidos?: () => void;
	carritoCantidad?: number;
};

export const Navbar = ({ onIrATienda, onIrAInicio, onIrACarrito, onIrALogin, onLogout, enTienda = false, estaLogueado = false, nombreCliente, onCambiarClave, onVerPerfil, onVerMisPedidos, carritoCantidad = 0 }: NavbarProps) => {
	const [menuAbierto, setMenuAbierto] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!menuAbierto) return;

		const handleClickFuera = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setMenuAbierto(false);
			}
		};

		document.addEventListener("mousedown", handleClickFuera);
		return () => document.removeEventListener("mousedown", handleClickFuera);
	}, [menuAbierto]);

	return (
		<nav className="bg-[#E6EAEF] border-b border-gray-300 flex items-center justify-between px-10 py-4 shadow-sm">
			<div className="flex items-center cursor-pointer" onClick={onIrAInicio}>
				<img src="/logo.svg" alt="Logo Celumarket" className="h-8" />
			</div>

			<div className="flex items-center gap-8">
				<ul className="flex items-center gap-6 text-gray-600 font-medium">
					<li className="hover:text-black cursor-pointer transition-colors" onClick={enTienda ? onIrAInicio : onIrATienda}>
						{enTienda ? "Inicio" : "Tienda"}
					</li>
					<li className="hover:text-black cursor-pointer transition-colors">
						Contacto
					</li>
					<li className="hover:text-black cursor-pointer transition-colors">
						Preguntas frecuentes
					</li>
				</ul>

				<div className="h-7 w-px bg-gray-300"></div>

				<div className="flex items-center gap-4">
					{estaLogueado && (
						<div ref={menuRef} className="relative">
							<button
								onClick={() => setMenuAbierto((v) => !v)}
								aria-expanded={menuAbierto}
								className="inline-flex items-center gap-1.5 text-sm text-[#1e1e1e] whitespace-nowrap rounded px-2 py-1 hover:bg-[#dce2e9] transition-colors"
							>
								<span>Hola, {nombreCliente ?? "Cliente"}</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className={`transition-transform duration-200 ${menuAbierto ? "rotate-180" : "rotate-0"}`}
								>
									<path d="m6 9 6 6 6-6"></path>
								</svg>
							</button>
							<div
								className={`absolute right-0 mt-2 w-44 origin-top rounded-md border border-gray-200 bg-white py-1 shadow-lg z-20 transition-all duration-200 ${menuAbierto ? "pointer-events-auto opacity-100 scale-y-100 translate-y-0" : "pointer-events-none opacity-0 scale-y-95 -translate-y-1"}`}
							>
								<button onClick={() => { setMenuAbierto(false); onVerPerfil?.(); }} className="block w-full px-3 py-2 text-left text-sm text-[#1e1e1e] hover:bg-[#f2f5f8]">
									Mi perfil
								</button>
								<button onClick={() => { setMenuAbierto(false); onVerMisPedidos?.(); }} className="block w-full px-3 py-2 text-left text-sm text-[#1e1e1e] hover:bg-[#f2f5f8]">
									Mis pedidos
								</button>
								<button onClick={() => { setMenuAbierto(false); onCambiarClave?.(); }} className="block w-full px-3 py-2 text-left text-sm text-[#1e1e1e] hover:bg-[#f2f5f8]">
									Cambiar clave
								</button>
								<button onClick={() => { setMenuAbierto(false); onLogout?.(); }} className="block w-full px-3 py-2 text-left text-sm text-[#b42318] hover:bg-[#fff1f0]">
									Cerrar sesión
								</button>
							</div>
						</div>
					)}
					<button onClick={onIrACarrito} className="relative cursor-pointer bg-[#015cb9] text-white p-2.5 rounded-full hover:bg-[#017AF4] transition-colors flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="9" cy="21" r="1"></circle>
							<circle cx="20" cy="21" r="1"></circle>
							<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
						</svg>
						{carritoCantidad > 0 && (
							<span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] rounded-full bg-white text-[#015cb9] text-[11px] font-bold flex items-center justify-center px-1">
								{carritoCantidad}
							</span>
						)}
					</button>

					{!estaLogueado && (
						<button onClick={onIrALogin} className="cursor-pointer bg-[#015cb9] hover:bg-[#017AF4] text-white font-medium py-2 px-6 rounded-md transition-colors">
							Iniciar sesión
						</button>
					)}
				</div>
			</div>
		</nav>
	);
};
