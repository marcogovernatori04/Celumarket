const lockIconUrl = "https://www.figma.com/api/mcp/asset/13e33deb-2d66-419c-af2f-9bd3ac0835b6";

const VisaBadge = () => (
	<img src="/visa.svg" alt="Visa" className="h-[30px] w-[45px]"/>
);

const MasterCardBadge = () => (
	<img src="/mastercard.svg" alt="Mastercard" className="h-[30px] w-[45px]" />
);

const MercadoPagoBadge = () => (
	<img src="/mercadopago.svg" alt="Mercado Pago" className="h-[30px] w-[86px]" />
);

export const CheckoutFooter = () => {
	return (
		<footer className="border-t border-[#d9d9d9] bg-[#d9d9d9]">
			<div className="mx-auto flex min-h-[124px] w-full max-w-[1120px] flex-wrap items-center justify-center gap-x-14 gap-y-4 px-6 py-4">
				<div className="flex shrink-0 items-center">
					<img src="/logo.svg" alt="Celumarket" className="h-8 w-auto object-contain" />
				</div>

				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2 text-[16px] text-black">
						<span className="inline-flex h-6 w-6 items-center justify-center">
							<img src={lockIconUrl} alt="Compra protegida" className="h-5 w-5 object-contain" />
						</span>
						<span className="leading-none">Compra 100% protegida</span>
					</div>
					<div className="flex items-center gap-2">
						<VisaBadge />
						<MasterCardBadge />
						<MercadoPagoBadge />
					</div>
				</div>

				<div className="flex min-w-[240px] flex-col gap-2">
					<p className="text-[16px] font-semibold leading-none text-black">¿Problemas con tu pago?</p>
					<p className="text-[12px] font-medium leading-none text-black">
						Escribinos a <span className="text-[#186c77]">ayuda@celumarket.com</span>
					</p>
					<p className="pt-2 text-[10px] leading-none text-[#666666]">© 2026 Celumarket. Todos los derechos reservados.</p>
				</div>
			</div>
		</footer>
	);
};
