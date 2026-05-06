export const Footer = () => {
	return (
		<footer className="border-t border-gray-300 bg-[#d9d9d9] px-8 py-8 md:px-12">
			<div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-[180px_180px_180px_minmax(280px,420px)]">
				<div className="flex items-start justify-center">
					<img src="/logo.svg" alt="Celumarket" className="h-7 w-auto object-contain" />
				</div>

				<div>
					<p className="mb-3 text-xl font-semibold text-[#001830]">Ayuda</p>
					<ul className="space-y-2 text-sm text-gray-700">
						<li>Políticas de devolución</li>
						<li>Tiempos y costos de envío</li>
						<li>Botón de arrepentimiento</li>
					</ul>
				</div>

				<div>
					<p className="mb-3 text-xl font-semibold text-[#001830]">Institucional</p>
					<ul className="space-y-2 text-sm text-gray-700">
						<li>Nosotros</li>
						<li>Contacto</li>
					</ul>
				</div>

				<div className="md:justify-self-end md:w-full md:max-w-[420px]">
					<p className="mb-3 text-sm text-gray-700">Suscribite al newsletter para recibir las últimas novedades!</p>
					<div className="flex flex-col gap-2 sm:flex-row">
						<input
							type="email"
							placeholder="Email..."
							className="h-10 flex-1 rounded-md border border-[#d9d9d9] bg-white px-3 text-sm text-[#1e1e1e] placeholder:text-[#757575] outline-none focus:border-[#005cb8]"
						/>
						<button className="h-10 rounded-md bg-[#005cb8] px-4 text-sm font-medium text-white hover:bg-[#004892]">
							Enviar
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
};
