import { useEffect, useRef, useState } from "react";
import { twNav } from "../styles/tw";

type NavbarProps = {
	onIrATienda?: () => void;
	onIrAInicio?: () => void;
	onIrAContacto?: () => void;
	onIrAPreguntasFrecuentes?: () => void;
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
	esAdmin?: boolean;
	esInterno?: boolean;
	rolUsuario?: string | null;
	onIrAAdmin?: () => void;
};

export const Navbar = ({
	onIrATienda,
	onIrAInicio,
	onIrAContacto,
	onIrAPreguntasFrecuentes,
	onIrACarrito,
	onIrALogin,
	onLogout,
	enTienda = false,
	estaLogueado = false,
	nombreCliente,
	onCambiarClave,
	onVerPerfil,
	onVerMisPedidos,
	carritoCantidad = 0,
	esAdmin = false,
	esInterno = false,
	rolUsuario,
	onIrAAdmin,
}: NavbarProps) => {
	const [menuAbierto, setMenuAbierto] = useState(false);
	const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
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

	const textoNavegacionPrincipal = esInterno ? "Catálogo" : enTienda ? "Inicio" : "Tienda";
	const accionNavegacionPrincipal = esInterno ? onIrATienda : enTienda ? onIrAInicio : onIrATienda;

	const cerrarMenus = () => {
		setMenuAbierto(false);
		setMenuMovilAbierto(false);
	};

	return (
		<nav className={twNav.navShell}>
			<div className={twNav.navContainer}>
				<div className="flex cursor-pointer items-center" onClick={onIrAInicio}>
					<img src="/logo.svg" alt="Logo Celumarket" className="h-7 sm:h-8" />
				</div>

				<div className="hidden items-center gap-8 lg:flex">
					<ul className={twNav.navLinks}>
						<li className={twNav.navLinkItem} onClick={esAdmin ? onIrAAdmin : accionNavegacionPrincipal}>
							{esAdmin ? "Panel admin" : textoNavegacionPrincipal}
						</li>
						<li className={twNav.navLinkItem} onClick={onIrAContacto}>
							Contacto
						</li>
						<li className={twNav.navLinkItem} onClick={onIrAPreguntasFrecuentes}>
							Preguntas frecuentes
						</li>
					</ul>

					<div className={twNav.navDivider}></div>

					<div className="flex items-center gap-4">
						{estaLogueado && (
							<div ref={menuRef} className="relative">
								<button onClick={() => setMenuAbierto((v) => !v)} aria-expanded={menuAbierto} className={twNav.navPillButton}>
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
									className={`${twNav.dropdownMenu} ${menuAbierto ? "pointer-events-auto translate-y-0 scale-y-100 opacity-100" : "pointer-events-none -translate-y-1 scale-y-95 opacity-0"}`}
								>
									{esInterno ? (
										<button
											onClick={() => {
												setMenuAbierto(false);
												onIrAAdmin?.();
											}}
											className={twNav.dropdownItem}
										>
											Panel admin{rolUsuario ? ` (${rolUsuario})` : ""}
										</button>
									) : (
										<>
											<button
												onClick={() => {
													setMenuAbierto(false);
													onVerPerfil?.();
												}}
												className={twNav.dropdownItem}
											>
												Mi perfil
											</button>
											<button
												onClick={() => {
													setMenuAbierto(false);
													onVerMisPedidos?.();
												}}
												className={twNav.dropdownItem}
											>
												Mis pedidos
											</button>
											<button
												onClick={() => {
													setMenuAbierto(false);
													onCambiarClave?.();
												}}
												className={twNav.dropdownItem}
											>
												Cambiar clave
											</button>
										</>
									)}
									<button
										onClick={() => {
											setMenuAbierto(false);
											onLogout?.();
										}}
										className={twNav.dropdownDanger}
									>
										Cerrar sesión
									</button>
								</div>
							</div>
						)}
						{!esInterno && (
							<button onClick={onIrACarrito} className={twNav.navbarCartBtn}>
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
								{carritoCantidad > 0 && <span className={twNav.navbarCartBadge}>{carritoCantidad}</span>}
							</button>
						)}
						{!estaLogueado && (
							<button onClick={onIrALogin} className={twNav.navbarLoginBtn}>
								Iniciar sesión
							</button>
						)}
					</div>
				</div>

				<div className="flex items-center gap-2 lg:hidden">
					{!esInterno && (
						<button onClick={onIrACarrito} className={twNav.navbarCartBtn}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
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
							{carritoCantidad > 0 && <span className={twNav.navbarCartBadge}>{carritoCantidad}</span>}
						</button>
					)}
					<button
						onClick={() => setMenuMovilAbierto((v) => !v)}
						className={twNav.navMobileIconBtn}
						aria-label="Abrir menú"
						aria-expanded={menuMovilAbierto}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="3" y1="6" x2="21" y2="6"></line>
							<line x1="3" y1="12" x2="21" y2="12"></line>
							<line x1="3" y1="18" x2="21" y2="18"></line>
						</svg>
					</button>
				</div>
			</div>

			{menuMovilAbierto && (
				<div className="px-4 pb-3 sm:px-6 lg:hidden">
					<div className={twNav.navMobilePanel}>
						<ul className={twNav.navMobileList}>
							<li>
								<button
									className={twNav.navMobileItemBtn}
									onClick={() => {
										cerrarMenus();
										(esAdmin ? onIrAAdmin : accionNavegacionPrincipal)?.();
									}}
								>
									{esAdmin ? "Panel admin" : textoNavegacionPrincipal}
								</button>
							</li>
							<li>
								<button className={twNav.navMobileItemBtn} onClick={() => { cerrarMenus(); onIrAContacto?.(); }}>
									Contacto
								</button>
							</li>
							<li>
								<button className={twNav.navMobileItemBtn} onClick={() => { cerrarMenus(); onIrAPreguntasFrecuentes?.(); }}>
									Preguntas frecuentes
								</button>
							</li>
							{estaLogueado && !esInterno && (
								<>
									<li><button className={twNav.navMobileItemBtn} onClick={() => { cerrarMenus(); onVerPerfil?.(); }}>Mi perfil</button></li>
									<li><button className={twNav.navMobileItemBtn} onClick={() => { cerrarMenus(); onVerMisPedidos?.(); }}>Mis pedidos</button></li>
									<li><button className={twNav.navMobileItemBtn} onClick={() => { cerrarMenus(); onCambiarClave?.(); }}>Cambiar clave</button></li>
								</>
							)}
							{estaLogueado && esInterno && (
								<li><button className={twNav.navMobileItemBtn} onClick={() => { cerrarMenus(); onIrAAdmin?.(); }}>Panel admin{rolUsuario ? ` (${rolUsuario})` : ""}</button></li>
							)}
							{!estaLogueado && (
								<li><button className={twNav.navMobileItemBtn} onClick={() => { cerrarMenus(); onIrALogin?.(); }}>Iniciar sesión</button></li>
							)}
							{estaLogueado && (
								<li><button className={`${twNav.navMobileItemBtn} text-[#b42318]`} onClick={() => { cerrarMenus(); onLogout?.(); }}>Cerrar sesión</button></li>
							)}
						</ul>
					</div>
				</div>
			)}
		</nav>
	);
};
