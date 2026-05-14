const METODO_PAGO_LABELS: Record<string, string> = {
	visa: "Visa",
	master: "Mastercard",
	mastercard: "Mastercard",
	amex: "American Express",
	argencard: "Argencard",
	cabal: "Cabal",
	naranja: "Naranja",
	naranja_x: "Naranja X",
	nativa: "Nativa",
	cencosud: "Cencosud",
	shopping: "Shopping",
	cordial: "Cordial",
	cmr: "CMR",
	diners: "Diners Club",
	discover: "Discover",
	jcb: "JCB",
	maestro: "Maestro",
	debmaster: "Mastercard Débito",
	debvisa: "Visa Débito",
	prex: "Prex",
	mercadopago: "Mercado Pago",
	account_money: "Dinero en cuenta de Mercado Pago",
	pagofacil: "Pago Fácil",
	rapipago: "Rapipago",
	link: "Red Link",
	banelco: "Banelco",
	cobroexpress: "Cobro Express",
	redelcom: "Redelcom",
	servipag: "Servipag",
	khipu: "Khipu",
	google_pay: "Google Pay",
	apple_pay: "Apple Pay",
	pix: "PIX",
	efecty: "Efecty",
	baloto: "Baloto",
	pse: "PSE",
	oxxo: "OXXO",
	serfinansa: "Serfinansa",
};

const TIPO_PAGO_LABELS: Record<string, string> = {
	credit_card: "Tarjeta de crédito",
	debit_card: "Tarjeta de débito",
	prepaid_card: "Tarjeta prepaga",
	account_money: "Dinero en cuenta",
	ticket: "Pago en efectivo",
	atm: "Pago en cajero",
	bank_transfer: "Transferencia bancaria",
	digital_currency: "Moneda digital",
	digital_wallet: "Billetera digital",
	crypto_transfer: "Transferencia cripto",
	mercado_pago: "Mercado Pago",
};

const toTitleCase = (value: string) =>
	value
		.replace(/[_-]+/g, " ")
		.trim()
		.split(" ")
		.filter(Boolean)
		.map((token) => token[0].toUpperCase() + token.slice(1).toLowerCase())
		.join(" ");

export const getMetodoPagoLabel = (metodoPagoId?: string | null) => {
	if (!metodoPagoId) return "No informado";
	return METODO_PAGO_LABELS[metodoPagoId.toLowerCase()] ?? toTitleCase(metodoPagoId);
};

export const getTipoPagoLabel = (tipoPagoId?: string | null) => {
	if (!tipoPagoId) return "No informado";
	return TIPO_PAGO_LABELS[tipoPagoId.toLowerCase()] ?? toTitleCase(tipoPagoId);
};
