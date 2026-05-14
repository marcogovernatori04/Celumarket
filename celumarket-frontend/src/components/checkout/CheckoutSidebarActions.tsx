import type { ItemCarrito } from "../../services/carritoService";

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

	return (
		<aside className="lg:sticky lg:top-0 lg:h-fit lg:self-start">
			<div className="rounded-xl border border-[#dfe5eb] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
				<p className="text-[15px] text-[#4b5563]">{pasoLabel}</p>
				<p className="mt-1 font-semibold text-[#001830]">{descripcion}</p>
				<div className="mt-3 space-y-2 border-t border-[#e6ecf2] pt-3">
					{items.map((item) => (
						<div key={item.variacionId} className="text-[14px] leading-tight text-[#1e1e1e]">
							<p className="font-semibold">{item.marca} {item.modelo}</p>
							<p className="text-[#4b5563]">{item.color} · x{item.cantidad}</p>
						</div>
					))}
				</div>
				<div className="mt-3 border-t border-[#e6ecf2] pt-3 text-[14px] text-[#1e1e1e]">
					<p>Subtotal: <span className="font-semibold">${subtotal.toLocaleString("es-AR")}</span></p>
					<p>Envío: <span className={costoEnvio === 0 ? "font-semibold text-[#1E8E5A]" : "font-semibold"}>{valorEnvioTexto}</span></p>
					<p className="mt-1 text-[23px] font-extrabold leading-none text-[#001830]">Total: ${total.toLocaleString("es-AR")}</p>
				</div>
				<div className="mt-3 flex flex-col gap-2">
					{secondaryLabel && onSecondary && (
						<button onClick={onSecondary} className="h-[40px] rounded-lg border border-[#001830] bg-[#f3f4f6] px-6 text-[#001830] hover:bg-[#e8ebf0] transition-colors">
							{secondaryLabel}
						</button>
					)}
					<button
						disabled={primaryDisabled}
						onClick={onPrimary}
						className={`h-[42px] rounded-lg px-6 text-white transition-colors ${!primaryDisabled ? "bg-[#015cb9] hover:bg-[#017AF4]" : "bg-[#94a3b8] cursor-not-allowed"}`}
					>
						{primaryLabel}
					</button>
					{onVolverCarrito && (
						<button onClick={onVolverCarrito} className="inline-flex w-fit text-[14px] font-medium text-[#001830] hover:text-[#015cb9] transition-colors">
							{carritoLabel}
						</button>
					)}
				</div>
			</div>
		</aside>
	);
};
