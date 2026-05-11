import { api } from "./api";

type LoginRequest = {
	email: string;
	password: string;
};

type LoginResponse = {
	mensaje: string;
	token: string;
};

export const authService = {
	async login(dto: LoginRequest): Promise<string> {
		const { data } = await api.post<LoginResponse>("/Clientes/login", dto);
		localStorage.setItem("token", data.token);
		return data.token;
	},

	logout() {
		localStorage.removeItem("token");
	},

	esTokenValido(token: string | null) {
		if (!token) return false;
		try {
			const [, payload] = token.split(".");
			if (!payload) return false;
			const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
			const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
			const jsonPayload = atob(padded);
			const parsed = JSON.parse(jsonPayload) as { exp?: number };
			if (!parsed.exp) return false;
			const ahoraSegundos = Math.floor(Date.now() / 1000);
			return parsed.exp > ahoraSegundos;
		} catch {
			return false;
		}
	},

	estaLogueado() {
		return authService.esTokenValido(localStorage.getItem("token"));
	},
};
