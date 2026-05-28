import { api } from "./api";

export const passwordService = {
	async cambiarClave(claveActual: string, claveNueva: string): Promise<void> {
		await api.post("/Clientes/cambiar-clave", { claveActual, claveNueva });
	},

	async solicitarRecuperacion(email: string): Promise<void> {
		await api.post("/Clientes/recuperar-clave/solicitar", { email });
	},

	async confirmarRecuperacion(tokenRecuperacion: string, claveNueva: string): Promise<void> {
		await api.post("/Clientes/recuperar-clave/confirmar", { tokenRecuperacion, claveNueva });
	},
};
