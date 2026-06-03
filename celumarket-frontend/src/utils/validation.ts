export const esEnteroPositivo = (value: string) => /^\d+$/.test(value.trim()) && Number(value) > 0;

export const esTextoUbicacionValido = (value: string) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]+$/.test(value.trim());

export const esNombreCompletoValido = (value: string) => {
	const trimmed = value.trim();
	return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]+$/.test(trimmed) && trimmed.split(/\s+/).length >= 2;
};

export const esDniValido = (value: string) => /^\d{7,8}$/.test(value.trim());

export const esEmailValido = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const esTelefonoValido = (value: string) => {
	const trimmed = value.trim();
	const digitos = trimmed.replace(/\D/g, "");
	return /^[\d\s()+-]+$/.test(trimmed) && digitos.length >= 6;
};
