import { twCatalogo } from "../styles/tw";

export const PorqueElegirnos = () => {
	return (
		<div className={twCatalogo.whyBuyWrap}>
			<h3 className={twCatalogo.whyBuyTitle}>
				¿Por qué comprar con nosotros?
			</h3>
			<div className={twCatalogo.whyBuyGrid}>
				<div>
					<div className={twCatalogo.whyBuyItemHead}>
						<span className={twCatalogo.whyBuyIconWrap}>
							<svg
								viewBox="0 0 24 24"
								className="size-7"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M12 2v20" />
								<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
							</svg>
						</span>
						<p className={twCatalogo.whyBuyItemTitle}>
							Mejores precios
						</p>
					</div>
					<p className={twCatalogo.whyBuyItemText}>
						Te garantizamos los mejores precios de la región, al contar
						con productos importados al menor precio.
					</p>
				</div>
				<div>
					<div className={twCatalogo.whyBuyItemHead}>
						<span className={twCatalogo.whyBuyIconWrap}>
							<svg
								viewBox="0 0 24 24"
								className="size-7"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M6 7h12l1 12H5L6 7z" />
								<path d="M9 7a3 3 0 0 1 6 0" />
							</svg>
						</span>
						<p className={twCatalogo.whyBuyItemTitle}>
							Amplia disponibilidad
						</p>
					</div>
					<p className={twCatalogo.whyBuyItemText}>
						Contamos con gran stock de productos y te traemos los últimos
						lanzamientos a tu alcance.
					</p>
				</div>
				<div>
					<div className={twCatalogo.whyBuyItemHead}>
						<span className={twCatalogo.whyBuyIconWrap}>
							<svg
								viewBox="0 0 24 24"
								className="size-7"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M3 7h11v9H3z" />
								<path d="M14 10h4l3 3v3h-7z" />
								<circle cx="7" cy="18" r="1.5" />
								<circle cx="18" cy="18" r="1.5" />
							</svg>
						</span>
						<p className={twCatalogo.whyBuyItemTitle}>
							Envío a todo el país
						</p>
					</div>
					<p className={twCatalogo.whyBuyItemText}>
						Realizamos envíos seguros y confiables para que tu compra
						llegue rápido.
					</p>
				</div>
			</div>
		</div>
	);
};
