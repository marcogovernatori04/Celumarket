import { twFooter } from "../styles/tw";

export const Footer = () => {
	return (
		<footer className={twFooter.footerShell}>
			<div className={twFooter.footerGrid}>
				<div className="flex items-start justify-start sm:justify-center">
					<img src="/logo.svg" alt="Celumarket" className="h-7 w-auto object-contain" />
				</div>

				<div>
					<p className={twFooter.footerTitle}>Ayuda</p>
					<ul className="space-y-2 text-sm text-gray-700">
						<li><button className={twFooter.footerLink}>Políticas de devolución</button></li>
						<li><button className={twFooter.footerLink}>Tiempos y costos de envío</button></li>
						<li><button className={twFooter.footerLink}>Botón de arrepentimiento</button></li>
					</ul>
				</div>

				<div>
					<p className={twFooter.footerTitle}>Institucional</p>
					<ul className="space-y-2 text-sm text-gray-700">
						<li><button className={twFooter.footerLink}>Nosotros</button></li>
						<li><button className={twFooter.footerLink}>Contacto</button></li>
					</ul>
				</div>

				<div className="w-full sm:col-span-2 lg:col-span-1 lg:justify-self-end lg:max-w-[520px]">
					<p className="mb-3 text-sm text-gray-700">Suscribite al newsletter para recibir las últimas novedades!</p>
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
		</footer>
	);
};
