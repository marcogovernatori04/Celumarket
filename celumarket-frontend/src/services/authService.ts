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

	estaLogueado() {
		return Boolean(localStorage.getItem("token"));
	},
};
