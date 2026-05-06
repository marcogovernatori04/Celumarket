export const PorqueElegirnos = () => {
	return (
		<div className="mt-14 mx-auto max-w-6xl rounded-2xl bg-white px-8 py-10 shadow-sm">
			<h3 className="text-center text-3xl font-bold text-[#001830] mb-10">
				¿Por qué comprar con nosotros?
			</h3>
			<div className="grid grid-cols-1 gap-10 md:grid-cols-3">
				<div>
					<div className="mb-3 flex items-center gap-3">
						<span className="inline-flex size-10 shrink-0 items-center justify-center text-slate-900">
							<svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M12 2v20" />
								<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
							</svg>
						</span>
						<p className="text-[26px] leading-none font-semibold text-[#001830]">Mejores precios</p>
					</div>
					<p className="pl-[52px] text-sm text-gray-600">
						Te garantizamos los mejores precios de la región, al contar con productos importados al menor precio.
					</p>
				</div>
				<div>
					<div className="mb-3 flex items-center gap-3">
						<span className="inline-flex size-10 shrink-0 items-center justify-center text-slate-900">
							<svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M6 7h12l1 12H5L6 7z" />
								<path d="M9 7a3 3 0 0 1 6 0" />
							</svg>
						</span>
						<p className="text-[26px] leading-none font-semibold text-[#001830]">Amplia disponibilidad</p>
					</div>
					<p className="pl-[52px] text-sm text-gray-600">
						Contamos con gran stock de productos y te traemos los últimos lanzamientos a tu alcance.
					</p>
				</div>
				<div>
					<div className="mb-3 flex items-center gap-3">
						<span className="inline-flex size-10 shrink-0 items-center justify-center text-slate-900">
							<svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M3 7h11v9H3z" />
								<path d="M14 10h4l3 3v3h-7z" />
								<circle cx="7" cy="18" r="1.5" />
								<circle cx="18" cy="18" r="1.5" />
							</svg>
						</span>
						<p className="text-[26px] leading-none font-semibold text-[#001830]">Envío a todo el país</p>
					</div>
					<p className="pl-[52px] text-sm text-gray-600">
						Realizamos envíos seguros y confiables para que tu compra llegue rápido.
					</p>
				</div>
			</div>
		</div>
	);
};
