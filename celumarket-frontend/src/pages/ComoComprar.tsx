import { Footer } from "../components/Footer";
import { twLayout } from "../styles/tw";

const pasos = [
	{
		titulo: "Elegí tu celular",
		texto: "Recorré el catálogo, compará modelos y revisá precio, stock, colores y características antes de decidir.",
	},
	{
		titulo: "Agregalo al carrito",
		texto: "Seleccioná la variante que querés comprar y confirmá la cantidad disponible para reservar el equipo.",
	},
	{
		titulo: "Completá tus datos",
		texto: "Cargá la información de envío y facturación. Si corresponde, el costo de envío se calcula durante el checkout.",
	},
	{
		titulo: "Pagá y seguí tu pedido",
		texto: "Podés pagar con Mercado Pago o transferencia. Después vas a poder consultar el estado desde Mis pedidos.",
	},
];

export const ComoComprar = () => {
	return (
		<div className={twLayout.publicPageShell}>
			<section className={twLayout.publicPageSection}>
				<h1 className="text-2xl font-bold text-[#001830] sm:text-3xl">Cómo comprar</h1>
				<p className="mt-2 max-w-3xl text-[#475569]">
					Comprar en Celumarket es simple: elegís el equipo, confirmás tus datos y seguís el estado de tu pedido desde la web.
				</p>

				<div className="mt-5 grid gap-3 md:grid-cols-2">
					{pasos.map((paso, index) => (
						<div key={paso.titulo} className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
							<div className="flex items-start gap-3">
								<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#015cb9] text-sm font-bold text-white">
									{index + 1}
								</span>
								<div>
									<h2 className="font-bold text-[#001830]">{paso.titulo}</h2>
									<p className="mt-1 text-sm leading-6 text-[#334155]">{paso.texto}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
			<Footer />
		</div>
	);
};
