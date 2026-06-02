import { Footer } from "../components/Footer";
import { twLayout } from "../styles/tw";

const valores = [
	"Equipos seleccionados con foco en precio, disponibilidad y garantía.",
	"Acompañamiento claro antes, durante y después de cada compra.",
	"Operación local pensada para que comprar un celular sea simple y confiable.",
];

export const Nosotros = () => {
	return (
		<div className={twLayout.publicPageShell}>
			<section className={twLayout.publicPageSection}>
				<div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
					<p className="text-xs font-bold uppercase tracking-[0.12em] text-[#64748b]">
						Quiénes somos
					</p>
					<h1 className="mt-2 text-2xl font-bold text-[#001830] sm:text-3xl">
						Somos Celumarket
					</h1>
					<div className="mt-4 space-y-3 text-sm leading-6 text-[#334155] sm:text-base">
						<p>
							Celumarket nació en San Nicolás de los Arroyos como un
							proyecto familiar para brindar tecnología móvil con una
							atención humana, personalizada y con información clara.
							Comenzamos recomendando equipos a conocidos y, con el
							tiempo, convertimos esa experiencia en una tienda pensada
							para comprar celulares de forma rápida, segura y
							transparente.
						</p>
						<p>
							Hoy trabajamos con un amplio catálogo curado, opciones de
							pago simples y seguimiento de pedidos para que el cliente
							siga su compra. Nos gusta combinar la eficiencia de una
							tienda online con el trato cercano de un local de
							confianza.
						</p>
					</div>

					<div className="mt-6 grid gap-3 sm:grid-cols-3">
						{valores.map((valor) => (
							<div
								key={valor}
								className="rounded-lg border border-[#dce4ed] bg-[#f8fafc] p-4 text-sm font-medium leading-5 text-[#001830]"
							>
								{valor}
							</div>
						))}
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
};
