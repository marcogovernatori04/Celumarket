export interface ConfiguracionSistema {
	descuentoTransferencia: number;
	umbralEnvioGratis: number;
	textoBannerHero: string;
	aliasTransferencia: string;
	cbuTransferencia: string;
	titularTransferencia: string;
	bancoTransferencia: string;
	urlImagenHero?: string | null;
}

export interface ActualizarConfiguracionSistema {
	descuentoTransferencia: number;
	umbralEnvioGratis: number;
	textoBannerHero: string;
	aliasTransferencia: string;
	cbuTransferencia: string;
	titularTransferencia: string;
	bancoTransferencia: string;
	urlImagenHero?: string | null;
}

