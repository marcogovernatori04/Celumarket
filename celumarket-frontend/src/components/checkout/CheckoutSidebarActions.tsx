import type { ItemCarrito } from "../../services/carritoService";
import { twBase, twCheckout } from "../../styles/tw";

type CheckoutSidebarActionsProps = {
	pasoLabel: string;
	descripcion: string;
	items: ItemCarrito[];
	subtotal: number;
	costoEnvio: number;
	total: number;
	primaryLabel: string;
	onPrimary: () => void;
	primaryDisabled?: boolean;
	secondaryLabel?: string;
	onSecondary?: () => void;
	carritoLabel?: string;
	onVolverCarrito?: () => void;
};

export const CheckoutSidebarActions = ({
	pasoLabel,
	descripcion,
	items,
	subtotal,
	costoEnvio,
	total,
	primaryLabel,
	onPrimary,
	primaryDisabled = false,
	secondaryLabel,
	onSecondary,
	carritoLabel = "← Volver al carrito",
	onVolverCarrito,
}: CheckoutSidebarActionsProps) => {
	const valorEnvioTexto = costoEnvio === 0 ? "Gratis" : `$${costoEnvio.toLocaleString("es-AR")}`;
	const actionsClass = secondaryLabel && onSecondary
		? "mt-2 grid grid-cols-2 gap-2 lg:mt-3 lg:flex lg:flex-col"
		: "mt-2 flex flex-col gap-2 lg:mt-3";

	return (
		<aside className={twCheckout.checkoutSidebarAside}>
			<div className={twCheckout.checkoutSidebarCard}>
				<p className={twCheckout.checkoutSidebarStepLabel}>{pasoLabel}</p>
				<p className={twCheckout.checkoutSidebarDesc}>{descripcion}</p>
				<div className={twCheckout.checkoutSidebarItems}>
					{items.map((item) => (
						<div key={item.variacionId} className="text-[14px] leading-tight text-[#1e1e1e]">
							<p className="font-semibold">{item.marca} {item.modelo}</p>
							<p className="text-[#4b5563]">{item.color} · x{item.cantidad}</p>
						</div>
					))}
				</div>
				<div className={twCheckout.checkoutSidebarPriceBox}>
					<div className="grid grid-cols-2 gap-1 lg:block">
						<p>Subtotal: <span className="font-semibold">${subtotal.toLocaleString("es-AR")}</span></p>
						<p>Envío: <span className={costoEnvio === 0 ? "font-semibold text-[#1E8E5A]" : "font-semibold"}>{valorEnvioTexto}</span></p>
					</div>
					<p className={twCheckout.checkoutSidebarTotal}>Total: ${total.toLocaleString("es-AR")}</p>
				</div>
				<div className={actionsClass}>
					{secondaryLabel && onSecondary && (
						<button onClick={onSecondary} className={`${twBase.secondaryBtnSm} mt-0 w-full px-3`}>
							{secondaryLabel}
						</button>
					)}
					<button
						disabled={primaryDisabled}
						onClick={onPrimary}
						className={`${twCheckout.checkoutPrimaryBtnSm} ${!primaryDisabled ? "bg-[#015cb9] hover:bg-[#017AF4]" : "cursor-not-allowed bg-[#94a3b8]"}`}
					>
						{primaryLabel}
					</button>
					{onVolverCarrito && (
						<button onClick={onVolverCarrito} className={`${twCheckout.checkoutBackLink} hidden lg:inline-flex`}>
							{carritoLabel}
						</button>
					)}
				</div>
			</div>
		</aside>
	);
};
