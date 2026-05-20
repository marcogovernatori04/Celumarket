import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { pedidoService, type DetallePedido as DetallePedidoData } from "../services/pedidoService";
import { configuracionService } from "../services/configuracionService";
import type { ConfiguracionSistema } from "../models/ConfiguracionSistema";
import { getMetodoPagoLabel, getTipoPagoLabel } from "../utils/mercadoPagoDisplay";
import { twDetallePedido } from "../styles/tw";

type DetallePedidoProps = {
	pedidoId: number;
	onVolver: () => void;
};

export const DetallePedido = ({ pedidoId, onVolver }: DetallePedidoProps) => {
	const [detalle, setDetalle] = useState<DetallePedidoData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [descargandoFactura, setDescargandoFactura] = useState(false);
	const [config, setConfig] = useState<ConfiguracionSistema | null>(null);

	useEffect(() => {
		const cargar = async () => {
			try {
				const [data, configData] = await Promise.all([
					pedidoService.obtenerDetalleMiPedido(pedidoId),
					configuracionService.obtener().catch(() => null)
				]);
				setDetalle(data);
				setConfig(configData);
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
	const metodoPagoNormalizado = detalle?.metodoPago?.trim().toLowerCase() ?? "";
	const estadoNormalizado = detalle?.estado?.trim().toLowerCase() ?? "";
	const mostrarDatosTransferencia =
		metodoPagoNormalizado.includes("transferencia") &&
		(estadoNormalizado.includes("pendiente") || estadoNormalizado.includes("pendiente de pago"));
	const subtotalProductos = detalle?.lineas.reduce((acc, linea) => acc + linea.subtotal, 0) ?? 0;
	const costoEnvio = detalle?.costoEnvio ?? 0;
	const totalEsperadoSinDescuento = subtotalProductos + costoEnvio;
	const descuentoTransferencia = Math.max(0, totalEsperadoSinDescuento - (detalle?.montoTotal ?? 0));
	const descuentoTransferenciaRedondeado = Math.round(descuentoTransferencia);

	return (
		<div className={twDetallePedido.layout}>
			<section className={twDetallePedido.section}>
				<button onClick={onVolver} className="mb-5 text-sm font-medium text-[#001830] hover:text-[#015cb9] transition-colors">← Volver a mis pedidos</button>
				<h1 className="mb-6 text-3xl font-bold text-[#001830]">Detalle del pedido #{pedidoId}</h1>
				<div className="mb-5">
					<button
						onClick={() => void descargarFactura()}
						disabled={descargandoFactura}
						className={`${twDetallePedido.primaryBtn} ${descargandoFactura ? "bg-[#94a3b8]" : "bg-[#015cb9] hover:bg-[#017AF4]"}`}
					>
						{descargandoFactura ? "Descargando factura..." : "Descargar factura"}
					</button>
				</div>
				{loading && <p className="text-gray-600">Cargando detalle...</p>}
				{error && <p className="text-red-600">{error}</p>}
				{!loading && !error && detalle && (
					<div className="space-y-4">
						<div className={twDetallePedido.panel}>
							<div className="grid gap-2 text-sm text-[#1e1e1e] md:grid-cols-2">
								<p>Estado: <span className="font-semibold">{detalle.estado}</span></p>
								<p>Método de pago: <span className="font-semibold">{detalle.metodoPago}</span></p>
								<p>Tipo de envío: <span className="font-semibold">{detalle.tipoEnvio}</span></p>
								<p>Costo de envío: <span className={`font-semibold ${detalle.costoEnvio === 0 ? "text-[#1E8E5A]" : ""}`}>{detalle.costoEnvio === 0 ? "Gratis" : `$${detalle.costoEnvio.toLocaleString("es-AR")}`}</span></p>
							</div>
							<p className="mt-2 text-sm text-[#1e1e1e]">Dirección de entrega: <span className="font-semibold">{formatearDireccion()}</span></p>
						</div>
						{mostrarDatosTransferencia && (
							<div className={twDetallePedido.panel}>
								<h2 className="text-xl font-bold text-[#001830]">Datos para transferencia</h2>
								<div className="mt-3 grid gap-2 text-sm text-[#1e1e1e] md:grid-cols-2">
									<p><span className="font-semibold">Titular:</span> {config?.titularTransferencia ?? "Celumarket S.A."}</p>
									<p><span className="font-semibold">Banco:</span> {config?.bancoTransferencia ?? "Banco Nación"}</p>
									<p><span className="font-semibold">Alias:</span> {config?.aliasTransferencia ?? "celumarket"}</p>
									<p><span className="font-semibold">CBU:</span> {config?.cbuTransferencia ?? "0000003100000000000000"}</p>
								</div>
							</div>
						)}
						<div className={twDetallePedido.panel}>
							<h2 className="text-xl font-bold text-[#001830]">Productos</h2>
							<div className="mt-3 space-y-2 border-t border-[#e5ebf2] pt-3">
								{detalle.lineas.map((linea) => (
									<div key={linea.id} className={twDetallePedido.productRow}>
										<div className="h-[108px] w-[108px] overflow-hidden rounded-md bg-[#ececec]">
											<img src={linea.urlImagen} alt={`${linea.marca} ${linea.modelo}`} className="h-[108px] w-[108px] scale-[1.22] object-contain" />
										</div>
										<p>{linea.marca} {linea.modelo} · {linea.color} · x{linea.cantidad}</p>
										<p className="font-semibold">${linea.subtotal.toLocaleString("es-AR")}</p>
									</div>
								))}
							</div>
							<div className="mt-4 space-y-1 border-t border-[#e5ebf2] pt-3 text-sm text-[#1e1e1e]">
								<div className="flex items-center justify-between">
									<span>Subtotal productos</span>
									<span className="font-semibold">${subtotalProductos.toLocaleString("es-AR")}</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Envío</span>
									<span className={`font-semibold ${costoEnvio === 0 ? "text-[#1E8E5A]" : ""}`}>
										{costoEnvio === 0 ? "Gratis" : `$${costoEnvio.toLocaleString("es-AR")}`}
									</span>
								</div>
								{descuentoTransferencia > 0 && (
									<div className="flex items-center justify-between text-[#1E8E5A]">
										<span>Descuento por transferencia</span>
										<span className="font-semibold">-${descuentoTransferenciaRedondeado.toLocaleString("es-AR")}</span>
									</div>
								)}
							</div>
							<p className="mt-4 border-t border-[#e5ebf2] pt-3 text-right text-[24px] font-extrabold leading-none text-[#001830]">Total: ${detalle.montoTotal.toLocaleString("es-AR")}</p>
						</div>
						{pagosMp.length > 0 && (
							<div className={twDetallePedido.panel}>
								<h2 className="text-xl font-bold text-[#001830]">Detalle del pago</h2>
								<div className="mt-3 space-y-3">
									{pagosMp.map((pago, idx) => (
										<div key={`${pago.paymentIdExterno ?? "pago"}-${idx}`} className={twDetallePedido.paymentItem}>
											<p className="text-sm font-semibold text-[#001830]">Medio #{idx + 1}</p>
											<div className={twDetallePedido.paymentGrid}>
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
