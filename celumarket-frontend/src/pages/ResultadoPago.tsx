import type { ReactNode } from "react";
import { Footer } from "../components/Footer";

type EstadoPago = "exitoso" | "fallido" | "pendiente";

type ResultadoPagoProps = {
	estado: EstadoPago;
	onIrATienda: () => void;
	onVerMisPedidos: () => void;
};

const contenidoPorEstado: Record<EstadoPago, { etiqueta: string; titulo: string; descripcion: string; color: string; fondo: string; icono: ReactNode }> = {
	exitoso: {
		etiqueta: "Confirmación de compra",
		titulo: "Pago exitoso",
		descripcion: "Tu pago con Mercado Pago fue aprobado correctamente.",
		color: "#1E8E5A",
		fondo: "#eaf8f1",
		icono: (
			<path d="M20 6 9 17l-5-5"></path>
		),
	},
	pendiente: {
		etiqueta: "Estado del pago",
		titulo: "Pago pendiente",
		descripcion: "Tu pago quedó pendiente de confirmación. Te avisaremos cuando se acredite.",
		color: "#B26A00",
		fondo: "#fff7e8",
		icono: (
			<>
				<circle cx="12" cy="12" r="9"></circle>
				<path d="M12 7v6"></path>
				<path d="m12 16 .01 0"></path>
			</>
		),
	},
	fallido: {
		etiqueta: "Estado del pago",
		titulo: "Pago rechazado",
		descripcion: "No pudimos procesar el pago. Podés intentarlo nuevamente con otro medio de pago.",
		color: "#B42318",
		fondo: "#fff0ef",
		icono: (
			<>
				<circle cx="12" cy="12" r="9"></circle>
				<path d="m15 9-6 6"></path>
				<path d="m9 9 6 6"></path>
			</>
		),
	},
};

export const ResultadoPago = ({ estado, onIrATienda, onVerMisPedidos }: ResultadoPagoProps) => {
	const contenido = contenidoPorEstado[estado];

	return (
		<div className="min-h-screen bg-[#f5f5f5] flex flex-col">
			<section className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
				<div className="rounded-3xl border border-[#dfe5eb] bg-white p-8 shadow-[0_12px_28px_rgba(0,24,48,0.08)] md:p-10">
					<p className="text-center text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">{contenido.etiqueta}</p>
					<div className="mx-auto mt-4 flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: contenido.fondo }}>
						<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={contenido.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							{contenido.icono}
						</svg>
					</div>
					<h1 className="mt-5 text-center text-[38px] font-extrabold leading-none text-[#001830]">{contenido.titulo}</h1>
					<p className="mx-auto mt-3 max-w-2xl text-center text-[17px] text-[#4b5563]">{contenido.descripcion}</p>
					<div className="mx-auto mt-7 max-w-2xl rounded-xl border border-[#e8edf3] bg-[#f8fafc] px-5 py-4 text-center text-[15px] text-[#334155]">
						Podés revisar el detalle y estado actualizado de tu pedido en Mis pedidos.
					</div>
					<div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<button onClick={onVerMisPedidos} className="h-12 rounded-lg bg-[#015cb9] px-7 text-[15px] font-semibold text-white hover:bg-[#017AF4] transition-colors">
							Ver mis pedidos
						</button>
						<button onClick={onIrATienda} className="h-12 rounded-lg border border-[#001830] bg-[#f3f4f6] px-7 text-[15px] font-semibold text-[#001830] hover:bg-[#e8ebf0] transition-colors">
							Volver a la tienda
						</button>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
};
