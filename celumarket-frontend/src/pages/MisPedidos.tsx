import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { pedidoService, type MisPedidosItem } from "../services/pedidoService";
import { twLayout } from "../styles/tw";
import { parseApiDate } from "../utils/dateTime";

type MisPedidosProps = {
	onVerDetalle: (pedidoId: number) => void;
};

export const MisPedidos = ({ onVerDetalle }: MisPedidosProps) => {
	const [pedidos, setPedidos] = useState<MisPedidosItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const cargar = async () => {
			try {
				const data = await pedidoService.obtenerMisPedidos();
				setPedidos(data);
			} catch {
				setError("No se pudieron cargar tus pedidos.");
			} finally {
				setLoading(false);
			}
		};
		void cargar();
	}, []);

	const formatearSoloFecha = (raw?: string) => {
		const fecha = parseApiDate(raw);
		if (!fecha) return "—";
		return fecha.toLocaleDateString("es-AR", {
			timeZone: "America/Argentina/Buenos_Aires",
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	return (
		<div className={twLayout.pageShell}>
			<section className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6">
				<h1 className="mb-4 text-2xl font-bold text-[#001830] sm:text-3xl">Mis pedidos</h1>
				{loading && <p className="text-gray-600">Cargando pedidos...</p>}
				{error && <p className="text-red-600">{error}</p>}
				{!loading && !error && pedidos.length === 0 && (
					<div className={twLayout.cardSoft}>
						<p className="text-[#1e1e1e]">Todavía no tienes pedidos.</p>
					</div>
				)}
				{!loading && !error && pedidos.length > 0 && (
					<div className="space-y-3">
						{pedidos.map((pedido) => (
							<div key={pedido.id} className={twLayout.cardSoft}>
								<div className="flex flex-wrap items-center justify-between gap-3">
									<button onClick={() => onVerDetalle(pedido.id)} className="inline-flex items-center gap-2 text-lg font-semibold text-[#001830] hover:text-[#015cb9] transition-colors">
										<span>Pedido #{pedido.id}</span>
										<span className="text-sm">Ver detalle</span>
									</button>
									<p className="text-[15px] font-bold text-[#001830]">${(pedido.montoTotal ?? 0).toLocaleString("es-AR")}</p>
								</div>
								<div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#4b5563]">
									<p>Estado: <span className="font-medium text-[#1e1e1e]">{pedido.estado ?? pedido.estadoPedido ?? "—"}</span></p>
									<p>Fecha: <span className="font-medium text-[#1e1e1e]">{formatearSoloFecha(pedido.fecha ?? pedido.fechaPedido ?? pedido.fechaCreacion)}</span></p>
								</div>
							</div>
						))}
					</div>
				)}
			</section>
			<Footer />
		</div>
	);
};
