import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://localhost:7119/api";

export const api = axios.create({
   baseURL: API_BASE_URL,
   headers: {
      'Content-Type': 'application/json'
   }
});

api.interceptors.request.use((config) => {
   const token = localStorage.getItem("token");
   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
});

api.interceptors.response.use(
   (response) => response,
   (error) => {
      const url = String(error?.config?.url ?? "");
      const esAuthPublica =
         url.includes("/Clientes/login") ||
         url.includes("/Clientes/registrar") ||
         url.includes("/Clientes/recuperar-clave");

      if (error?.response?.status === 401 && !esAuthPublica) {
         localStorage.removeItem("token");
         window.dispatchEvent(new Event("auth:unauthorized"));
      }
      return Promise.reject(error);
   }
);
