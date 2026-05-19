import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { pedidoService, type DetallePedido as DetallePedidoData } from "../services/pedidoService";
import { getMetodoPagoLabel, getTipoPagoLabel } from "../utils/mercadoPagoDisplay";

type DetallePedidoProps = {
	pedidoId: number;
	onVolver: () => void;
};

export const DetallePedido = ({ pedidoId, onVolver }: DetallePedidoProps) => {
	const [detalle, setDetalle] = useState<DetallePedidoData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [descargandoFactura, setDescargandoFactura] = useState(false);

	useEffect(() => {
		const cargar = async () => {
			try {
				const data = await pedidoService.obtenerDetalleMiPedido(pedidoId);
				setDetalle(data);
			} catch {
				setError("No se pudo cargar el detalle del pedido.");
			} finally {
				setLoading(false);
			}
		};
		void cargar();
	}, [pedidoId]);

	const formatearDireccion = () => {
		if (!detalle?.direccionEntrega) return "Se coordina según el tipo de envío.";
		const d = detalle.direccionEntrega;
		return `${d.calle} ${d.numero}${d.pisoDepto ? ` - ${d.pisoDepto}` : ""}, ${d.localidad}, ${d.provincia} (CP ${d.codigoPostal})`;
	};

	const descargarFactura = async () => {
		try {
			setDescargandoFactura(true);
			const blob = await pedidoService.descargarFacturaMiPedido(pedidoId);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `Factura-Pedido-${pedidoId}.pdf`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
		} catch {
			setError("No se pudo descargar la factura.");
		} finally {
			setDescargandoFactura(false);
		}
	};

	const pagosMpRaw = detalle?.pagosMercadoPago && detalle.pagosMercadoPago.length > 0
		? detalle.pagosMercadoPago
		: (detalle?.datosPagoMercadoPago ? [detalle.datosPagoMercadoPago] : []);

	const pagosMp = pagosMpRaw.filter((pago, idx, arr) => {
		const id = pago.paymentIdExterno?.trim();
		if (!id) return true;
		return arr.findIndex((p) => p.paymentIdExterno?.trim() === id) === idx;
	});

	return (
		<div className="min-h-screen bg-[#f5f5f5] flex flex-col">
			<section className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
				<button onClick={onVolver} className="mb-5 text-sm font-medium text-[#001830] hover:text-[#015cb9] transition-colors">← Volver a mis pedidos</button>
				<h1 className="mb-6 text-3xl font-bold text-[#001830]">Detalle del pedido #{pedidoId}</h1>
				<div className="mb-5">
					<button
						onClick={() => void descargarFactura()}
						disabled={descargandoFactura}
						className={`h-10 rounded-md px-4 text-sm font-semibold text-white transition-colors ${descargandoFactura ? "bg-[#94a3b8]" : "bg-[#015cb9] hover:bg-[#017AF4]"}`}
					>
						{descargandoFactura ? "Descargando factura..." : "Descargar factura"}
					</button>
				</div>
				{loading && <p className="text-gray-600">Cargando detalle...</p>}
				{error && <p className="text-red-600">{error}</p>}
				{!loading && !error && detalle && (
					<div className="space-y-4">
						<div className="rounded-lg border border-[#dfe5eb] bg-white p-5 shadow-sm">
							<div className="grid gap-2 text-sm text-[#1e1e1e] md:grid-cols-2">
								<p>Estado: <span className="font-semibold">{detalle.estado}</span></p>
								<p>Método de pago: <span className="font-semibold">{detalle.metodoPago}</span></p>
								<p>Tipo de envío: <span className="font-semibold">{detalle.tipoEnvio}</span></p>
								<p>Costo de envío: <span className={`font-semibold ${detalle.costoEnvio === 0 ? "text-[#1E8E5A]" : ""}`}>{detalle.costoEnvio === 0 ? "Gratis" : `$${detalle.costoEnvio.toLocaleString("es-AR")}`}</span></p>
							</div>
							<p className="mt-2 text-sm text-[#1e1e1e]">Dirección de entrega: <span className="font-semibold">{formatearDireccion()}</span></p>
						</div>
						<div className="rounded-lg border border-[#dfe5eb] bg-white p-5 shadow-sm">
							<h2 className="text-xl font-bold text-[#001830]">Productos</h2>
							<div className="mt-3 space-y-2 border-t border-[#e5ebf2] pt-3">
								{detalle.lineas.map((linea) => (
									<div key={linea.id} className="grid grid-cols-[108px_1fr_auto] items-center gap-3 rounded-md bg-[#f8fafc] p-2.5 text-sm text-[#1e1e1e]">
										<div className="h-[108px] w-[108px] overflow-hidden rounded-md bg-[#ececec]">
											<img src={linea.urlImagen} alt={`${linea.marca} ${linea.modelo}`} className="h-[108px] w-[108px] scale-[1.22] object-contain" />
										</div>
										<p>{linea.marca} {linea.modelo} · {linea.color} · x{linea.cantidad}</p>
										<p className="font-semibold">${linea.subtotal.toLocaleString("es-AR")}</p>
									</div>
								))}
							</div>
							<p className="mt-4 border-t border-[#e5ebf2] pt-3 text-right text-[24px] font-extrabold leading-none text-[#001830]">Total: ${detalle.montoTotal.toLocaleString("es-AR")}</p>
						</div>
						{pagosMp.length > 0 && (
							<div className="rounded-lg border border-[#dfe5eb] bg-white p-5 shadow-sm">
								<h2 className="text-xl font-bold text-[#001830]">Detalle del pago</h2>
								<div className="mt-3 space-y-3">
									{pagosMp.map((pago, idx) => (
										<div key={`${pago.paymentIdExterno ?? "pago"}-${idx}`} className="rounded-lg border border-[#e5ebf2] bg-[#f8fafc] p-3">
											<p className="text-sm font-semibold text-[#001830]">Medio #{idx + 1}</p>
											<div className="mt-1 grid grid-cols-1 gap-1 text-[14px] text-[#334155] sm:grid-cols-2">
												<p>Método: {getMetodoPagoLabel(pago.metodoPagoId)}</p>
												<p>Tipo: {getTipoPagoLabel(pago.tipoPagoId)}</p>
												<p>Cuotas: {pago.cuotas > 0 ? pago.cuotas : 1}</p>
												<p>Monto pagado: ${(pago.montoPagado ?? pago.montoTotalFinal ?? 0).toLocaleString("es-AR")}</p>
												{pago.valorCuota ? <p>Valor cuota: ${pago.valorCuota.toLocaleString("es-AR")}</p> : null}
												{pago.paymentIdExterno ? <p>Id pago MP: {pago.paymentIdExterno}</p> : null}
											</div>
										</div>
									))}
									<p className="border-t border-[#e5ebf2] pt-2 text-sm font-semibold text-[#001830]">
										Total abonado: ${pagosMp.reduce((acc, p) => acc + (p.montoPagado ?? p.montoTotalFinal ?? 0), 0).toLocaleString("es-AR")}
									</p>
								</div>
							</div>
						)}
					</div>
				)}
			</section>
			<Footer />
		</div>
	);
};
