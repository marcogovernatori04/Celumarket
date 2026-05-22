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

	obtenerPayload(token: string | null): Record<string, unknown> | null {
		if (!token) return null;
		try {
			const [, payload] = token.split(".");
			if (!payload) return null;
			const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
			const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
			const jsonPayload = atob(padded);
			return JSON.parse(jsonPayload) as Record<string, unknown>;
		} catch {
			return null;
		}
	},

	esTokenValido(token: string | null) {
		if (!token) return false;
		try {
			const parsed = authService.obtenerPayload(token) as { exp?: number } | null;
			if (!parsed?.exp) return false;
			const ahoraSegundos = Math.floor(Date.now() / 1000);
			return parsed.exp > ahoraSegundos;
		} catch {
			return false;
		}
	},

	obtenerRol(token: string | null): string | null {
		const payload = authService.obtenerPayload(token);
		if (!payload) return null;
		const roleClaim = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
		if (typeof roleClaim === "string" && roleClaim.trim().length > 0) return roleClaim;
		if (Array.isArray(roleClaim) && typeof roleClaim[0] === "string") return roleClaim[0];
		if (typeof payload.role === "string" && payload.role.trim().length > 0) return payload.role;
		return null;
	},

	obtenerRolActual(): string | null {
		return authService.obtenerRol(localStorage.getItem("token"));
	},

	esAdmin() {
		return authService.obtenerRolActual() === "Admin";
	},

	esVentas() {
		return authService.obtenerRolActual() === "Ventas";
	},

	esSoporte() {
		return authService.obtenerRolActual() === "Soporte";
	},

	esCliente() {
		return authService.obtenerRolActual() === "Cliente";
	},

	esInterno() {
		const rol = authService.obtenerRolActual();
		return rol === "Admin" || rol === "Ventas" || rol === "Soporte";
	},

	estaLogueado() {
		return authService.esTokenValido(localStorage.getItem("token"));
	},
};
