import { useState } from "react";
import { Footer } from "../components/Footer";

const faqs = [
	{
		pregunta: "¿Qué medios de pago aceptan?",
		respuesta:
			"Puedes pagar con Mercado Pago (dinero en cuenta, débito o crédito) o por transferencia bancaria.",
	},
	{
		pregunta: "¿Cuánto tiempo tengo para pagar por transferencia?",
		respuesta:
			"El pedido queda reservado dentro del plazo indicado para transferencia. Si no se acredita en ese período, puede cancelarse automáticamente.",
	},
	{
		pregunta: "¿Cómo sé si mi pedido ya fue despachado?",
		respuesta:
			"En la sección 'Mis pedidos' podrás ver el estado actualizado y el código de seguimiento cuando el envío haya sido despachado.",
	},
	{
		pregunta: "¿Hacen envíos a todo el país?",
		respuesta:
			"Trabajamos con cobertura por código postal. En checkout puedes consultar costo y disponibilidad según tu zona.",
	},
	{
		pregunta: "¿Dónde descargo mi factura?",
		respuesta:
			"Cuando el pago está aprobado, la factura queda disponible en el detalle del pedido para su descarga en PDF.",
	},
	{
		pregunta: "¿Puedo cancelar una compra?",
		respuesta:
			"Sí, siempre que la operación no haya avanzado a un estado irreversible de despacho o entrega. Si necesitas ayuda, contáctanos.",
	},
];

export const PreguntasFrecuentes = () => {
	const [abierta, setAbierta] = useState<number | null>(0);

	return (
		<div className="min-h-[calc(100dvh-64px)] bg-[#f5f5f5] flex flex-col">
			<section className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
				<h1 className="text-2xl font-bold text-[#001830] sm:text-3xl">Preguntas frecuentes</h1>
				<p className="mt-2 text-[#475569]">
					Respuestas rápidas sobre pagos, envíos, pedidos y facturación.
				</p>

				<div className="mt-5 space-y-3">
					{faqs.map((item, idx) => {
						const isOpen = abierta === idx;
						return (
							<div key={item.pregunta} className="rounded-xl border border-black/10 bg-white shadow-sm">
								<button
									onClick={() => setAbierta(isOpen ? null : idx)}
									className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
								>
									<span className="font-semibold leading-snug text-[#001830]">{item.pregunta}</span>
									<span className="text-[#334155]">{isOpen ? "−" : "+"}</span>
								</button>
								{isOpen && (
									<div className="border-t border-[#e5ebf2] px-4 py-3 text-sm text-[#334155]">
										{item.respuesta}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</section>
			<Footer />
		</div>
	);
};
