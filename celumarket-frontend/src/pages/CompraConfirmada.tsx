import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { configuracionService } from "../services/configuracionService";
import type { ConfiguracionSistema } from "../models/ConfiguracionSistema";

type CompraConfirmadaProps = {
	pedidoId: number | null;
	onIrATienda: () => void;
	onVerMisPedidos: () => void;
};

export const CompraConfirmada = ({ pedidoId, onIrATienda, onVerMisPedidos }: CompraConfirmadaProps) => {
	const [config, setConfig] = useState<ConfiguracionSistema | null>(null);

	useEffect(() => {
		const cargarConfig = async () => {
			try {
				const data = await configuracionService.obtener();
				setConfig(data);
			} catch {
				setConfig(null);
			}
		};
		void cargarConfig();
	}, []);

	return (
		<div className="min-h-[calc(100dvh-72px)] bg-[#f5f5f5] flex flex-col">
			<section className="mx-auto w-full max-w-4xl flex-1 min-h-0 px-6 py-6 overflow-auto">
				<div className="rounded-2xl border border-[#dfe5eb] bg-white p-7 shadow-sm">
					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff7e8]">
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B26A00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							<circle cx="12" cy="12" r="9"></circle>
							<path d="M12 7v6"></path>
							<path d="m12 16 .01 0"></path>
						</svg>
					</div>
					<h1 className="mt-4 text-center text-3xl font-extrabold text-[#001830]">¡Reserva confirmada!</h1>
					<p className="mt-2 text-center text-[#4b5563]">
						Recibimos tu reserva correctamente. Para completar la compra, realizá la transferencia y luego podrás seguir su estado en Mis pedidos.
						{pedidoId ? ` Número de pedido: #${pedidoId}.` : ""}
					</p>
					<div className="mx-auto mt-5 max-w-2xl rounded-xl border border-[#e8edf3] bg-[#f8fafc] px-5 py-3 text-[15px] text-[#334155]">
						<p className="text-[16px] font-semibold text-[#001830]">Datos para transferencia</p>
						<p className="mt-2"><span className="font-semibold">Titular:</span> {config?.titularTransferencia ?? "Celumarket S.A."}</p>
						<p><span className="font-semibold">Banco:</span> {config?.bancoTransferencia ?? "Banco Nación"}</p>
						<p><span className="font-semibold">Alias:</span> {config?.aliasTransferencia ?? "celumarket"}</p>
						<p><span className="font-semibold">CBU:</span> {config?.cbuTransferencia ?? "0000003100000000000000"}</p>
					</div>
					<p className="mt-4 text-center text-[#4b5563]">Podés revisar esta reserva/pedido en la sección Mis pedidos.</p>
					<div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<button onClick={onVerMisPedidos} className="h-11 rounded-lg bg-[#015cb9] px-6 text-white hover:bg-[#017AF4] transition-colors">
							Ver mis pedidos
						</button>
						<button onClick={onIrATienda} className="h-11 rounded-lg border border-[#001830] bg-[#f3f4f6] px-6 text-[#001830] hover:bg-[#e8ebf0] transition-colors">
							Volver a la tienda
						</button>
					</div>
				</div>
			</section>
			<div className="mt-auto">
				<Footer />
			</div>
		</div>
	);
};
