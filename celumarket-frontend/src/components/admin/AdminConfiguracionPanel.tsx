import { useEffect, useState } from "react";
import { configuracionService } from "../../services/configuracionService";
import type { ConfiguracionSistema } from "../../models/ConfiguracionSistema";

const estadoInicial: ConfiguracionSistema = {
	descuentoTransferencia: 10,
	umbralEnvioGratis: 499999,
	textoBannerHero: "¡Bienvenido!",
	aliasTransferencia: "celumarket",
	cbuTransferencia: "0000003100000000000000",
	titularTransferencia: "Celumarket S.A.",
	bancoTransferencia: "Banco Nación",
};

export const AdminConfiguracionPanel = () => {
	const [form, setForm] = useState<ConfiguracionSistema>(estadoInicial);
	const [cargando, setCargando] = useState(true);
	const [guardando, setGuardando] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [ok, setOk] = useState<string | null>(null);

	useEffect(() => {
		const cargar = async () => {
			try {
				const config = await configuracionService.obtener();
				setForm(config);
			} catch {
				setError("No se pudo cargar la configuración.");
			} finally {
				setCargando(false);
			}
		};
		void cargar();
	}, []);

	const guardar = async () => {
		setGuardando(true);
		setError(null);
		setOk(null);
		try {
			const actualizada = await configuracionService.actualizar({
				descuentoTransferencia: Number(form.descuentoTransferencia),
				umbralEnvioGratis: Number(form.umbralEnvioGratis),
				textoBannerHero: form.textoBannerHero,
				aliasTransferencia: form.aliasTransferencia,
				cbuTransferencia: form.cbuTransferencia,
				titularTransferencia: form.titularTransferencia,
				bancoTransferencia: form.bancoTransferencia,
			});
			setForm(actualizada);
			setOk("Configuración guardada.");
		} catch {
			setError("No se pudo guardar la configuración.");
		} finally {
			setGuardando(false);
		}
	};

	if (cargando) {
		return (
			<div className="rounded-lg border border-[#dbe4ef] bg-[#f6f9fc] p-5">
				<p className="text-[#5b6673]">Cargando configuración...</p>
			</div>
		);
	}

	return (
		<div className="rounded-lg border border-[#dbe4ef] bg-[#f6f9fc] p-5">
			<p className="text-[18px] font-semibold text-[#001830]">
				Configuración general
			</p>
			<p className="mt-1 text-[#5b6673]">
				Edita el banner del hero y reglas globales de promociones.
			</p>

			<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
				<label className="flex flex-col gap-1 text-sm text-[#334155] md:col-span-2">
					Texto debajo del hero
					<input
						value={form.textoBannerHero}
						onChange={(e) =>
							setForm((prev) => ({ ...prev, textoBannerHero: e.target.value }))
						}
						className="h-10 rounded-md border border-[#cfd8e3] bg-white px-3 outline-none focus:border-[#015cb9]"
					/>
				</label>

				<label className="flex flex-col gap-1 text-sm text-[#334155]">
					Umbral envío gratis
					<input
						type="number"
						value={form.umbralEnvioGratis}
						onChange={(e) =>
							setForm((prev) => ({
								...prev,
								umbralEnvioGratis: Number(e.target.value),
							}))
						}
						className="h-10 rounded-md border border-[#cfd8e3] bg-white px-3 outline-none focus:border-[#015cb9]"
					/>
				</label>

				<label className="flex flex-col gap-1 text-sm text-[#334155]">
					Descuento transferencia (%)
					<input
						type="number"
						step="0.1"
						value={form.descuentoTransferencia}
						onChange={(e) =>
							setForm((prev) => ({
								...prev,
								descuentoTransferencia: Number(e.target.value),
							}))
						}
						className="h-10 rounded-md border border-[#cfd8e3] bg-white px-3 outline-none focus:border-[#015cb9]"
					/>
				</label>

				<label className="flex flex-col gap-1 text-sm text-[#334155] md:col-span-2">
					Titular transferencia
					<input
						value={form.titularTransferencia}
						onChange={(e) =>
							setForm((prev) => ({ ...prev, titularTransferencia: e.target.value }))
						}
						className="h-10 rounded-md border border-[#cfd8e3] bg-white px-3 outline-none focus:border-[#015cb9]"
					/>
				</label>

				<label className="flex flex-col gap-1 text-sm text-[#334155]">
					Alias transferencia
					<input
						value={form.aliasTransferencia}
						onChange={(e) =>
							setForm((prev) => ({ ...prev, aliasTransferencia: e.target.value }))
						}
						className="h-10 rounded-md border border-[#cfd8e3] bg-white px-3 outline-none focus:border-[#015cb9]"
					/>
				</label>

				<label className="flex flex-col gap-1 text-sm text-[#334155]">
					CBU transferencia
					<input
						value={form.cbuTransferencia}
						onChange={(e) =>
							setForm((prev) => ({ ...prev, cbuTransferencia: e.target.value }))
						}
						className="h-10 rounded-md border border-[#cfd8e3] bg-white px-3 outline-none focus:border-[#015cb9]"
					/>
				</label>

				<label className="flex flex-col gap-1 text-sm text-[#334155] md:col-span-2">
					Banco transferencia
					<input
						value={form.bancoTransferencia}
						onChange={(e) =>
							setForm((prev) => ({ ...prev, bancoTransferencia: e.target.value }))
						}
						className="h-10 rounded-md border border-[#cfd8e3] bg-white px-3 outline-none focus:border-[#015cb9]"
					/>
				</label>
			</div>

			<div className="mt-4 flex items-center gap-3">
				<button
					onClick={() => void guardar()}
					disabled={guardando}
					className="rounded-md bg-[#015cb9] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#017AF4] disabled:opacity-60"
				>
					{guardando ? "Guardando..." : "Guardar cambios"}
				</button>
				{ok && <span className="text-sm text-[#1E8E5A]">{ok}</span>}
				{error && <span className="text-sm text-[#b91c1c]">{error}</span>}
			</div>
		</div>
	);
};

