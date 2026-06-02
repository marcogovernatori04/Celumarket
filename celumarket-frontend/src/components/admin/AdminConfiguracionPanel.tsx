import { useEffect, useState } from "react";
import { celularService } from "../../services/celularService";
import type { CelularListado } from "../../models/Celular";
import type { CelularDestacado } from "../../models/CelularDetalle";
import { configuracionService } from "../../services/configuracionService";
import type { ConfiguracionSistema } from "../../models/ConfiguracionSistema";
import { twAdmin, twBase } from "../../styles/tw";

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
	const [celulares, setCelulares] = useState<CelularListado[]>([]);
	const [destacados, setDestacados] = useState<Record<number, CelularDestacado>>({});
	const [textosPromocion, setTextosPromocion] = useState<Record<number, string>>({});
	const [cargando, setCargando] = useState(true);
	const [cargandoDestacados, setCargandoDestacados] = useState(true);
	const [guardando, setGuardando] = useState(false);
	const [guardandoDestacadoId, setGuardandoDestacadoId] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [ok, setOk] = useState<string | null>(null);
	const [busquedaDestacados, setBusquedaDestacados] = useState("");

	async function cargarDestacados() {
		try {
			setCargandoDestacados(true);
			const acumulados: CelularListado[] = [];
			let pagina = 1;
			let totalPaginas = 1;

			do {
				const data = await celularService.obtenerCatalogoPaginado(pagina, 50);
				acumulados.push(...data.items);
				totalPaginas = data.totalPaginas || 1;
				pagina += 1;
			} while (pagina <= totalPaginas);

			const destacadosActuales = await celularService.obtenerDestacados(Math.max(acumulados.length, 1));
			const porId = destacadosActuales.reduce<Record<number, CelularDestacado>>((acc, destacado) => {
				acc[destacado.id] = destacado;
				return acc;
			}, {});
			const textos = destacadosActuales.reduce<Record<number, string>>((acc, destacado) => {
				acc[destacado.id] = destacado.textoPromocion ?? "";
				return acc;
			}, {});

			setCelulares(acumulados);
			setDestacados(porId);
			setTextosPromocion(textos);
		} catch {
			setError("No se pudo cargar la configuración de destacados.");
		} finally {
			setCargandoDestacados(false);
		}
	}

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
		void cargarDestacados();
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

	const actualizarDestacado = async (celular: CelularListado, esDestacado: boolean) => {
		setGuardandoDestacadoId(celular.id);
		setError(null);
		setOk(null);
		const textoPromocion = textosPromocion[celular.id] ?? destacados[celular.id]?.textoPromocion ?? "";

		try {
			await celularService.configurarDestacado(celular.id, {
				esDestacado,
				textoPromocion: textoPromocion.trim() || null,
			});
			setDestacados((prev) => {
				if (!esDestacado) {
					const siguiente = { ...prev };
					delete siguiente[celular.id];
					return siguiente;
				}
				return {
					...prev,
					[celular.id]: {
						id: celular.id,
						marca: celular.marca,
						modelo: celular.modelo,
						precio: celular.precioMinimo,
						precioAnterior: null,
						cantidadColores: celular.cantidadColores,
						textoPromocion: textoPromocion.trim() || null,
						urlImagenPrincipal: celular.urlImagenPrincipal,
					},
				};
			});
			setOk(esDestacado ? "Producto destacado actualizado." : "Producto quitado de destacados.");
		} catch {
			setError("No se pudo actualizar el destacado.");
		} finally {
			setGuardandoDestacadoId(null);
		}
	};

	const guardarTextoPromocion = async (celular: CelularListado) => {
		if (!destacados[celular.id]) return;
		await actualizarDestacado(celular, true);
	};

	const celularesFiltrados = celulares.filter((celular) => {
		const termino = busquedaDestacados.trim().toLowerCase();
		if (!termino) return true;
		return `${celular.marca} ${celular.modelo}`.toLowerCase().includes(termino);
	});
	const celularesSeleccionados = celulares.filter((celular) => destacados[celular.id]);

	const totalDestacados = Object.keys(destacados).length;

	if (cargando) {
		return (
			<div className={twBase.loadingBox}>
				<p className="text-[#5b6673]">Cargando configuración...</p>
			</div>
		);
	}

	return (
		<div className={twBase.loadingBox}>
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
						className={twAdmin.adminConfigInput}
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
						className={twAdmin.adminConfigInput}
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
						className={twAdmin.adminConfigInput}
					/>
				</label>

				<label className="flex flex-col gap-1 text-sm text-[#334155] md:col-span-2">
					Titular transferencia
					<input
						value={form.titularTransferencia}
						onChange={(e) =>
							setForm((prev) => ({ ...prev, titularTransferencia: e.target.value }))
						}
						className={twAdmin.adminConfigInput}
					/>
				</label>

				<label className="flex flex-col gap-1 text-sm text-[#334155]">
					Alias transferencia
					<input
						value={form.aliasTransferencia}
						onChange={(e) =>
							setForm((prev) => ({ ...prev, aliasTransferencia: e.target.value }))
						}
						className={twAdmin.adminConfigInput}
					/>
				</label>

				<label className="flex flex-col gap-1 text-sm text-[#334155]">
					CBU transferencia
					<input
						value={form.cbuTransferencia}
						onChange={(e) =>
							setForm((prev) => ({ ...prev, cbuTransferencia: e.target.value }))
						}
						className={twAdmin.adminConfigInput}
					/>
				</label>

				<label className="flex flex-col gap-1 text-sm text-[#334155] md:col-span-2">
					Banco transferencia
					<input
						value={form.bancoTransferencia}
						onChange={(e) =>
							setForm((prev) => ({ ...prev, bancoTransferencia: e.target.value }))
						}
						className={twAdmin.adminConfigInput}
					/>
				</label>
			</div>

			<div className="mt-6 rounded-lg border border-[#dbe4ef] bg-white p-4">
				<div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
					<div>
						<p className="text-[16px] font-semibold text-[#001830]">Destacados de landing</p>
						<p className="mt-1 text-sm text-[#5b6673]">
							Definí qué productos aparecen en la sección de destacados y su texto promocional.
						</p>
					</div>
					<span className="w-fit rounded-full bg-[#eaf4ff] px-3 py-1 text-xs font-semibold text-[#015cb9]">
						{totalDestacados} activos
					</span>
				</div>

				<input
					value={busquedaDestacados}
					onChange={(e) => setBusquedaDestacados(e.target.value)}
					placeholder="Buscar por marca o modelo..."
					className={`${twAdmin.adminConfigInput} mt-4 w-full text-sm`}
				/>

				{cargandoDestacados ? (
					<p className="mt-4 text-sm text-[#5b6673]">Cargando productos...</p>
				) : celularesFiltrados.length === 0 ? (
					<p className="mt-4 text-sm text-[#5b6673]">No hay productos para esa búsqueda.</p>
				) : (
					<>
						<div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10">
							{celularesFiltrados.map((celular) => {
								const activo = Boolean(destacados[celular.id]);
								const guardandoEste = guardandoDestacadoId === celular.id;

								return (
									<button
										key={celular.id}
										type="button"
										title={`${celular.marca} ${celular.modelo}`}
										aria-pressed={activo}
										disabled={guardandoEste}
										onClick={() => void actualizarDestacado(celular, !activo)}
										className={`group relative aspect-square rounded-lg border bg-white p-2 transition-all disabled:opacity-60 ${
											activo
												? "border-[#015cb9] shadow-[0_0_0_2px_rgba(1,92,185,0.14)]"
												: "border-[#dbe4ef] hover:border-[#9fc5ef] hover:bg-[#f8fbff]"
										}`}
									>
										<img
											src={celular.urlImagenPrincipal}
											alt={`${celular.marca} ${celular.modelo}`}
											className="h-full w-full object-contain"
										/>
										<span
											className={`absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold transition-colors ${
												activo ? "bg-[#015cb9] text-white" : "bg-white/90 text-[#94a3b8] ring-1 ring-[#cbd5e1]"
											}`}
										>
											{activo ? "✓" : "+"}
										</span>
										<span className="pointer-events-none absolute inset-x-1 bottom-1 hidden rounded bg-[#001830]/85 px-1 py-0.5 text-[10px] font-semibold leading-tight text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100">
											{celular.modelo}
										</span>
									</button>
								);
							})}
						</div>

						<div className="mt-5 border-t border-[#dbe4ef] pt-4">
							<p className="text-sm font-semibold text-[#001830]">Textos promocionales</p>
							{celularesSeleccionados.length === 0 ? (
								<p className="mt-2 text-sm text-[#64748b]">Seleccioná productos en la grilla para editar su texto.</p>
							) : (
								<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
									{celularesSeleccionados.map((celular) => {
										const guardandoEste = guardandoDestacadoId === celular.id;
										const textoLocal = textosPromocion[celular.id] ?? "";
										const textoGuardado = destacados[celular.id]?.textoPromocion ?? "";
										const textoModificado = textoLocal.trim() !== textoGuardado.trim();

										return (
											<div key={celular.id} className="min-w-0 rounded-lg border border-[#dbe4ef] bg-[#f8fafc] p-3">
												<div className="flex items-center gap-3">
													<img
														src={celular.urlImagenPrincipal}
														alt={`${celular.marca} ${celular.modelo}`}
														className="h-12 w-12 shrink-0 rounded-md bg-[#edf2f7] object-contain"
													/>
													<div className="min-w-0">
														<p className="truncate text-sm font-semibold text-[#001830]">
															{celular.marca} {celular.modelo}
														</p>
														<p className="text-xs text-[#64748b]">${celular.precioMinimo.toLocaleString("es-AR")}</p>
													</div>
												</div>

												<div className="mt-3 grid grid-cols-1 gap-2">
													<input
														value={textoLocal}
														disabled={guardandoEste}
														onChange={(e) =>
															setTextosPromocion((prev) => ({ ...prev, [celular.id]: e.target.value }))
														}
														placeholder="Texto promocional opcional"
														className={`${twAdmin.adminConfigInput} text-sm disabled:bg-[#f1f5f9] disabled:text-[#94a3b8]`}
													/>
													<button
														type="button"
														disabled={!textoModificado || guardandoEste}
														onClick={() => void guardarTextoPromocion(celular)}
														className="h-10 rounded-md border border-[#015cb9] px-3 text-sm font-semibold text-[#015cb9] transition-colors hover:bg-[#eaf4ff] disabled:border-[#cbd5e1] disabled:text-[#94a3b8]"
													>
														{guardandoEste ? "Guardando..." : "Guardar texto"}
													</button>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</>
				)}
			</div>

			<div className="mt-5 flex flex-col gap-2 border-t border-[#dbe4ef] pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
				{ok && <span className="text-sm text-[#1E8E5A]">{ok}</span>}
				{error && <span className="text-sm text-[#b91c1c]">{error}</span>}
				<button
					onClick={() => void guardar()}
					disabled={guardando}
					className="h-10 rounded-md bg-[#015cb9] px-4 text-sm font-medium text-white transition-colors hover:bg-[#017AF4] disabled:opacity-60"
				>
					{guardando ? "Guardando..." : "Guardar cambios"}
				</button>
			</div>
		</div>
	);
};

