const TZ_AR = "America/Argentina/Buenos_Aires";

const hasTimezoneInfo = (value: string) => /([zZ]|[+-]\d{2}:\d{2})$/.test(value);

export const parseApiDate = (raw?: string): Date | null => {
	if (!raw) return null;
	const value = raw.trim();
	if (!value) return null;

	// Si viene ISO sin offset, lo interpretamos como UTC para evitar corrimientos.
	if (!hasTimezoneInfo(value) && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
		const asUtc = new Date(`${value}Z`);
		if (!Number.isNaN(asUtc.getTime())) return asUtc;
	}

	const parsed = new Date(value);
	if (!Number.isNaN(parsed.getTime())) return parsed;

	return null;
};

export const formatDateTimeAr = (raw?: string): string => {
	const date = parseApiDate(raw);
	if (!date) return "—";
	return date.toLocaleString("es-AR", {
		timeZone: TZ_AR,
		hour12: false,
	});
};

export const formatDateAr = (raw?: string): string => {
	const date = parseApiDate(raw);
	if (!date) return "—";
	return date.toLocaleDateString("es-AR", {
		timeZone: TZ_AR,
	});
};
