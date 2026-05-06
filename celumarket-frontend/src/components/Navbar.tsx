type NavbarProps = {
	onIrATienda?: () => void;
	onIrAInicio?: () => void;
	enTienda?: boolean;
};

export const Navbar = ({ onIrATienda, onIrAInicio, enTienda = false }: NavbarProps) => {
	return (
		<nav className="bg-[#F5F5F5] flex items-center justify-between px-10 py-4 shadow-sm">
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

				<div className="h-6 w-px bg-gray-200"></div>

				<div className="flex items-center gap-4">
					<button className="bg-[#015cb9] text-white p-2.5 rounded-full hover:bg-[#017AF4] transition-colors flex items-center justify-center">
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
					</button>

					<button className="bg-[#015cb9] hover:bg-[#017AF4] text-white font-medium py-2 px-6 rounded-md transition-colors">
						Iniciar sesión
					</button>
				</div>
			</div>
		</nav>
	);
};
