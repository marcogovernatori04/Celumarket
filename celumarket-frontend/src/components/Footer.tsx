import { twFooter } from "../styles/tw";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
	const navigate = useNavigate();
	const [newsletterAbierto, setNewsletterAbierto] = useState(false);
	const [ayudaAbierta, setAyudaAbierta] = useState(false);
	const [institucionalAbierta, setInstitucionalAbierta] = useState(false);

	return (
		<footer className={twFooter.footerShell}>
			<div className={twFooter.footerGrid}>
				<div className="flex items-start justify-start sm:justify-center">
					<img src="/logo.svg" alt="Celumarket" className="h-7 w-auto object-contain" />
				</div>

				<div>
					<button
						type="button"
						onClick={() => setAyudaAbierta((abierta) => !abierta)}
						className="flex w-full items-center justify-between gap-3 rounded-md py-1 text-left text-sm font-semibold text-[#001830] sm:hidden"
						aria-expanded={ayudaAbierta}
					>
						<span>Ayuda</span>
						<span className={`text-lg leading-none transition-transform duration-200 ${ayudaAbierta ? "rotate-180" : "rotate-0"}`}>
							⌄
						</span>
					</button>
					<p className={`${twFooter.footerTitle} hidden sm:block`}>Ayuda</p>
					<ul className={`${ayudaAbierta ? "block animate-[mobileMenuDrop_180ms_ease-out]" : "hidden"} mt-2 space-y-2 text-sm text-gray-700 sm:mt-0 sm:block`}>
						<li><button className={twFooter.footerLink} onClick={() => navigate("/como-comprar")}>Cómo comprar</button></li>
						<li><button className={twFooter.footerLink}>Botón de arrepentimiento</button></li>
					</ul>
				</div>

				<div>
					<button
						type="button"
						onClick={() => setInstitucionalAbierta((abierta) => !abierta)}
						className="flex w-full items-center justify-between gap-3 rounded-md py-1 text-left text-sm font-semibold text-[#001830] sm:hidden"
						aria-expanded={institucionalAbierta}
					>
						<span>Institucional</span>
						<span className={`text-lg leading-none transition-transform duration-200 ${institucionalAbierta ? "rotate-180" : "rotate-0"}`}>
							⌄
						</span>
					</button>
					<p className={`${twFooter.footerTitle} hidden sm:block`}>Institucional</p>
					<ul className={`${institucionalAbierta ? "block animate-[mobileMenuDrop_180ms_ease-out]" : "hidden"} mt-2 space-y-2 text-sm text-gray-700 sm:mt-0 sm:block`}>
						<li><button className={twFooter.footerLink} onClick={() => navigate("/nosotros")}>Nosotros</button></li>
						<li><button className={twFooter.footerLink} onClick={() => navigate("/contacto")}>Contacto</button></li>
					</ul>
				</div>

				<div className="w-full sm:col-span-2 lg:col-span-1 lg:justify-self-end lg:max-w-[520px]">
					<button
						type="button"
						onClick={() => setNewsletterAbierto((abierto) => !abierto)}
						className="flex w-full items-center justify-between gap-3 rounded-md py-1 text-left text-sm font-semibold text-[#001830] md:hidden"
						aria-expanded={newsletterAbierto}
					>
						<span>Newsletter</span>
						<span className={`text-lg leading-none transition-transform duration-200 ${newsletterAbierto ? "rotate-180" : "rotate-0"}`}>
							⌄
						</span>
					</button>
					<div className={`${newsletterAbierto ? "block animate-[mobileMenuDrop_180ms_ease-out]" : "hidden"} md:block`}>
						<p className="mb-3 mt-2 text-sm text-gray-700 md:mt-0">Suscribite al newsletter para recibir las últimas novedades!</p>
						<div className="flex flex-col gap-2 md:flex-row">
						<input
							type="email"
							placeholder="Email..."
							className={twFooter.newsletterInput}
						/>
						<button className={twFooter.newsletterBtn}>
							Enviar
						</button>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
