import { Footer } from "../components/Footer";

type CompraConfirmadaProps = {
	pedidoId: number | null;
	onIrATienda: () => void;
	onVerMisPedidos: () => void;
};

export const CompraConfirmada = ({ pedidoId, onIrATienda, onVerMisPedidos }: CompraConfirmadaProps) => {
	return (
		<div className="min-h-screen bg-[#f5f5f5] flex flex-col">
			<section className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
				<div className="rounded-2xl border border-[#dfe5eb] bg-white p-8 shadow-sm">
					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f6ef]">
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1E8E5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							<path d="M20 6 9 17l-5-5"></path>
						</svg>
					</div>
					<h1 className="mt-4 text-center text-3xl font-extrabold text-[#001830]">¡Compra confirmada!</h1>
					<p className="mt-2 text-center text-[#4b5563]">
						Tu pedido se generó correctamente.
						{pedidoId ? ` Número de pedido: #${pedidoId}.` : ""}
					</p>
					<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<button onClick={onVerMisPedidos} className="h-11 rounded-lg bg-[#015cb9] px-6 text-white hover:bg-[#017AF4] transition-colors">
							Ver mis pedidos
						</button>
						<button onClick={onIrATienda} className="h-11 rounded-lg border border-[#001830] bg-[#f3f4f6] px-6 text-[#001830] hover:bg-[#e8ebf0] transition-colors">
							Volver a la tienda
						</button>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
};
