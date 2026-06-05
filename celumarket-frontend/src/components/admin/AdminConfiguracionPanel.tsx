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
	urlImagenHero: null,
};

export const AdminConfiguracionPanel = () => {
	const [form, setForm] = useState<ConfiguracionSistema>(estadoInicial);
	const [celulares, setCelulares] = useState<CelularListado[]>([]);
	const [destacados, setDestacados] = useState<Record<number, CelularDestacado>>({});
	const [textosPromocion, setTextosPromocion] = useState<Record<number, string>>({});
	const [cargando, setCargando] = useState(true);
	const [cargandoDestacados, setCargandoDestacados] = useState(true);
	const [guardando, setGuardando] = useState(false);
	const [subiendoHero, setSubiendoHero] = useState(false);
	const [guardandoDestacadoId, setGuardandoDestacadoId] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [ok, setOk] = useState<string | null>(null);
	const [errorHero, setErrorHero] = useState<string | null>(null);
	const [okHero, setOkHero] = useState<string | null>(null);
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
		setErrorHero(null);
		try {
			const urlImagenHero = form.urlImagenHero?.trim() || null;
			if (urlImagenHero) {
				try {
					new URL(urlImagenHero);
				} catch {
					setErrorHero("La URL de la imagen del hero no es válida.");
					return;
				}
			}

			const actualizada = await configuracionService.actualizar({
				descuentoTransferencia: Number(form.descuentoTransferencia),
				umbralEnvioGratis: Number(form.umbralEnvioGratis),
				textoBannerHero: form.textoBannerHero,
				aliasTransferencia: form.aliasTransferencia,
				cbuTransferencia: form.cbuTransferencia,
				titularTransferencia: form.titularTransferencia,
				bancoTransferencia: form.bancoTransferencia,
				urlImagenHero,
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

	const subirImagenHero = async (archivo: File | null) => {
		if (!archivo) return;
		setSubiendoHero(true);
		setErrorHero(null);
		setOkHero(null);
		try {
			const actualizada = await configuracionService.subirImagenHero(archivo);
			setForm(actualizada);
			setOkHero("Imagen del hero actualizada.");
		} catch {
			setErrorHero("No se pudo subir la imagen del hero.");
		} finally {
			setSubiendoHero(false);
		}
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
		<div className={`${twBase.loadingBox} flex min-h-0 flex-col p-0 lg:h-full`}>
			<div className="min-h-0 flex-1 overflow-y-auto p-5">
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

				<div className="md:col-span-2 rounded-lg border border-[#dbe4ef] bg-white p-3">
					<div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
						<div>
							<p className="text-sm font-semibold text-[#001830]">Imagen del hero</p>
							<p className="mt-1 text-xs text-[#64748b]">
								Si no hay imagen seleccionada, la landing usa el gradiente actual.
							</p>
						</div>
						<label className="inline-flex h-9 w-fit cursor-pointer items-center rounded-md border border-[#015cb9] px-3 text-sm font-semibold text-[#015cb9] transition-colors hover:bg-[#eaf4ff]">
							{subiendoHero ? "Subiendo..." : "Seleccionar imagen"}
							<input
								type="file"
								accept="image/*"
								disabled={subiendoHero}
								onChange={(e) => {
									const archivo = e.target.files?.[0] ?? null;
									void subirImagenHero(archivo);
									e.currentTarget.value = "";
								}}
								className="hidden"
							/>
						</label>
					</div>

					{form.urlImagenHero ? (
						<div className="mt-3 grid gap-3 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
							<div
								className="h-28 rounded-lg bg-cover bg-center"
								style={{ backgroundImage: `linear-gradient(rgba(0,24,48,0.28), rgba(0,24,48,0.28)), url(${form.urlImagenHero})` }}
							/>
							<div className="min-w-0">
								<input
									value={form.urlImagenHero}
									onChange={(e) => {
										setErrorHero(null);
										setOkHero(null);
										setForm((prev) => ({ ...prev, urlImagenHero: e.target.value }));
									}}
									className={`${twAdmin.adminConfigInput} w-full text-sm`}
									placeholder="URL de imagen del hero"
								/>
								<button
									type="button"
									onClick={() => {
										setErrorHero(null);
										setOkHero(null);
										setForm((prev) => ({ ...prev, urlImagenHero: null }));
									}}
									className="mt-2 h-8 rounded border border-[#94a3b8] bg-[#e5e7eb] px-3 text-xs font-semibold text-[#1f2937] hover:bg-[#d1d5db]"
								>
									Quitar imagen y usar gradiente
								</button>
							</div>
						</div>
					) : (
						<div className="mt-3 rounded-lg bg-gradient-to-r from-[#001830] to-[#0a0a0a] px-4 py-6 text-sm font-semibold text-white">
							Vista previa con gradiente actual
						</div>
					)}
					{okHero && <p className="mt-3 text-sm font-semibold text-[#1E8E5A]">{okHero}</p>}
					{errorHero && <p className="mt-3 text-sm font-semibold text-[#b91c1c]">{errorHero}</p>}
				</div>

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
										className={`group relative aspect-square p-2 transition-all disabled:opacity-60 ${twBase.productImageFrame} ${
											activo
												? "!border-[#015cb9] shadow-[0_0_0_2px_rgba(1,92,185,0.14)]"
												: "hover:!border-[#9fc5ef]"
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
													<div className={`h-12 w-12 shrink-0 p-1 ${twBase.productImageFrame}`}>
														<img
															src={celular.urlImagenPrincipal}
															alt={`${celular.marca} ${celular.modelo}`}
															className={twBase.productImageContain}
														/>
													</div>
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

			</div>

			<div className="flex shrink-0 flex-col gap-2 border-t border-[#dbe4ef] bg-[#f6f9fc] px-5 py-3 shadow-[0_-8px_18px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-end sm:gap-3">
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

