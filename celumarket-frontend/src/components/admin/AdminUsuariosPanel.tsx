import { useEffect, useState } from "react";
import { clienteService, type UsuarioListado } from "../../services/clienteService";
import { twAdmin, twBase } from "../../styles/tw";

export const AdminUsuariosPanel = () => {
	const [usuarios, setUsuarios] = useState<UsuarioListado[]>([]);
	const [cargando, setCargando] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [recargando, setRecargando] = useState(false);
	const [expandidoId, setExpandidoId] = useState<number | null>(null);
	const [busqueda, setBusqueda] = useState("");

	const cargarUsuarios = async (esRecarga = false) => {
		if (esRecarga) setRecargando(true);
		else setCargando(true);
		setError(null);
		try {
			const data = await clienteService.obtenerUsuarios();
			setUsuarios(data);
		} catch {
			setError("No se pudo cargar la lista de clientes.");
		} finally {
			if (esRecarga) setRecargando(false);
			else setCargando(false);
		}
	};

	useEffect(() => {
		void cargarUsuarios();
	}, []);

	const busquedaNormalizada = busqueda.trim().toLowerCase();
	const usuariosFiltrados = usuarios.filter((u) => {
		if (!busquedaNormalizada) return true;
		const termino = busquedaNormalizada.startsWith("#")
			? busquedaNormalizada.slice(1)
			: busquedaNormalizada;

		const tokensNombre = (u.nombreCompleto ?? "")
			.toLowerCase()
			.split(/\s+/)
			.filter(Boolean);
		const tokensEmail = (u.email ?? "")
			.toLowerCase()
			.split(/\s+/)
			.filter(Boolean);
		const telefono = (u.telefono ?? "").toLowerCase();

		const nombreMatch = tokensNombre.some((token) => token.startsWith(termino));
		const emailMatch = tokensEmail.some((token) => token.startsWith(termino));
		const telefonoMatch = telefono.startsWith(termino);

		return nombreMatch || emailMatch || telefonoMatch;
	});

	if (cargando) {
		return (
			<div className={twBase.loadingBox}>
				<p className="text-[#5b6673]">Cargando clientes...</p>
			</div>
		);
	}

	if (error) {
		return (
			<p className="mt-6 text-red-600">{error}</p>
		);
	}

	return (
		<div className="min-w-0">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<h2 className={twAdmin.adminSectionTitle}>Clientes</h2>
				<button
					onClick={() => void cargarUsuarios(true)}
					disabled={recargando}
					className={`${twBase.actionBtnPrimary} disabled:opacity-60`}
				>
					{recargando ? "Recargando..." : "Recargar"}
				</button>
			</div>
			<p className="mt-1 text-sm text-[#5b6673]">
				Listado general de clientes registrados. Total: {usuariosFiltrados.length}
			</p>
			<div className="mt-3">
				<input
					value={busqueda}
					onChange={(e) => setBusqueda(e.target.value)}
					placeholder="Buscar por nombre, email o teléfono..."
					className={`${twBase.searchInput} w-full max-w-[420px]`}
				/>
			</div>

			<div className="mt-4 space-y-3 lg:hidden">
				{usuariosFiltrados.length === 0 ? (
					<div className="rounded-xl border border-black/10 bg-white px-4 py-8 text-center text-[#64748b]">
						No hay clientes para el filtro seleccionado.
					</div>
				) : (
					usuariosFiltrados.map((u) => (
						<div key={u.id} className="rounded-xl border border-black/10 bg-white p-3 shadow-sm">
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0">
									<p className="break-words text-base font-semibold leading-snug text-[#001830]">{u.nombreCompleto}</p>
									<p className="mt-1 break-words text-sm text-[#1e293b]">{u.email || "-"}</p>
									<p className="mt-1 text-xs font-semibold uppercase tracking-[0.06em] text-[#64748b]">{u.rol || "-"}</p>
								</div>
								<button
									onClick={() => setExpandidoId((prev) => (prev === u.id ? null : u.id))}
									className={twBase.iconButton}
								>
									{expandidoId === u.id ? "−" : "+"}
								</button>
							</div>

							{expandidoId === u.id && (
								<div className="mt-3 border-t border-black/10 bg-[#f8fafc] pt-3">
									<div className="grid grid-cols-1 gap-2 text-sm text-[#334155]">
										<p><span className="font-semibold text-[#001830]">Teléfono:</span> {u.telefono || "-"}</p>
										<p><span className="font-semibold text-[#001830]">Total comprado:</span> ${u.totalComprado.toLocaleString("es-AR")}</p>
										<p><span className="font-semibold text-[#001830]">Cantidad de pedidos:</span> {u.cantidadPedidos}</p>
										<p><span className="font-semibold text-[#001830]">Dirección de envío:</span> {formatearDireccion(u)}</p>
									</div>
								</div>
							)}
						</div>
					))
				)}
			</div>

			<div className="mt-6 hidden overflow-auto rounded-xl border border-black/10 lg:block">
				<div className="min-w-[720px]">
				<div className={`grid grid-cols-[1.3fr_1.4fr_0.9fr_90px] items-center px-4 py-3 ${twBase.tableHead}`}>
					<span>Nombre</span>
					<span>Email</span>
					<span>Rol</span>
					<span className="text-center">Ver más</span>
				</div>
				<div className="divide-y divide-black/10 bg-white">
					{usuariosFiltrados.length === 0 ? (
						<div className="px-4 py-8 text-center text-[#64748b]">
							No hay clientes para el filtro seleccionado.
						</div>
					) : (
						usuariosFiltrados.map((u) => (
							<div key={u.id}>
								<div className="grid grid-cols-[1.3fr_1.4fr_0.9fr_90px] items-center px-4 py-3">
									<p className="text-base font-semibold text-[#001830]">{u.nombreCompleto}</p>
									<p className="text-sm text-[#1e293b]">{u.email || "-"}</p>
									<p className="text-sm text-[#1e293b]">{u.rol || "-"}</p>
									<div className="flex justify-center">
										<button
											onClick={() => setExpandidoId((prev) => (prev === u.id ? null : u.id))}
											className={twBase.iconButton}
										>
											{expandidoId === u.id ? "−" : "+"}
										</button>
									</div>
								</div>

								{expandidoId === u.id && (
									<div className="border-t border-black/10 bg-[#f8fafc] px-5 py-4">
										<div className="grid grid-cols-1 gap-3 text-sm text-[#334155] md:grid-cols-2">
											<p>
												<span className="font-semibold text-[#001830]">Teléfono:</span>{" "}
												{u.telefono || "-"}
											</p>
											<p>
												<span className="font-semibold text-[#001830]">Total comprado:</span>{" "}
												${u.totalComprado.toLocaleString("es-AR")}
											</p>
											<p>
												<span className="font-semibold text-[#001830]">Cantidad de pedidos:</span>{" "}
												{u.cantidadPedidos}
											</p>
											<p>
												<span className="font-semibold text-[#001830]">Dirección de envío:</span>{" "}
												{formatearDireccion(u)}
											</p>
										</div>
									</div>
								)}
							</div>
						))
					)}
				</div>
				</div>
			</div>
		</div>
	);
};

const formatearDireccion = (u: UsuarioListado): string => {
	const calle = u.calle?.trim();
	const numero = u.numero?.trim();
	const piso = u.pisoDepto?.trim();
	const localidad = u.localidad?.trim();
	const provincia = u.provincia?.trim();
	const cp = u.codigoPostal;

	const parteCalle = [calle, numero].filter(Boolean).join(" ");
	const partePiso = piso && piso !== "-" ? piso : "";
	const parteCiudad = [localidad, provincia].filter(Boolean).join(", ");
	const parteCp = cp && cp > 0 ? `CP ${cp}` : "";

	const direccion = [parteCalle, partePiso, parteCiudad, parteCp]
		.filter(Boolean)
		.join(" · ");

	return direccion || "Sin dirección cargada";
};
