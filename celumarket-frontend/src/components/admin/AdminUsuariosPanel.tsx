import { useEffect, useState } from "react";
import { clienteService, type UsuarioListado } from "../../services/clienteService";

export const AdminUsuariosPanel = () => {
	const [usuarios, setUsuarios] = useState<UsuarioListado[]>([]);
	const [cargando, setCargando] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [recargando, setRecargando] = useState(false);
	const [expandidoId, setExpandidoId] = useState<number | null>(null);

	const cargarUsuarios = async (esRecarga = false) => {
		if (esRecarga) setRecargando(true);
		else setCargando(true);
		setError(null);
		try {
			const data = await clienteService.obtenerUsuarios();
			setUsuarios(data);
		} catch {
			setError("No se pudo cargar la lista de usuarios.");
		} finally {
			if (esRecarga) setRecargando(false);
			else setCargando(false);
		}
	};

	useEffect(() => {
		void cargarUsuarios();
	}, []);

	if (cargando) {
		return (
			<div className="rounded-lg border border-[#dbe4ef] bg-[#f6f9fc] p-5">
				<p className="text-[#5b6673]">Cargando usuarios...</p>
			</div>
		);
	}

	if (error) {
		return (
			<p className="mt-6 text-red-600">{error}</p>
		);
	}

	return (
		<div>
			<div className="flex items-center justify-between gap-3">
				<h2 className="text-2xl font-bold text-[#001830]">Usuarios</h2>
				<button
					onClick={() => void cargarUsuarios(true)}
					disabled={recargando}
					className="h-9 rounded-md bg-[#015cb9] px-3 text-sm font-semibold text-white hover:bg-[#017AF4] disabled:opacity-60"
				>
					{recargando ? "Recargando..." : "Recargar"}
				</button>
			</div>
			<p className="mt-1 text-sm text-[#5b6673]">
				Listado general de usuarios registrados. Total: {usuarios.length}
			</p>

			<div className="mt-6 overflow-hidden rounded-xl border border-black/10">
				<div className="grid grid-cols-[1.3fr_1.4fr_0.9fr_90px] items-center bg-[#eef3f8] px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#334155]">
					<span>Nombre</span>
					<span>Email</span>
					<span>Rol</span>
					<span className="text-center">Ver más</span>
				</div>
				<div className="divide-y divide-black/10 bg-white">
					{usuarios.length === 0 ? (
						<div className="px-4 py-8 text-center text-[#64748b]">
							No hay usuarios para mostrar.
						</div>
					) : (
						usuarios.map((u) => (
							<div key={u.id}>
								<div className="grid grid-cols-[1.3fr_1.4fr_0.9fr_90px] items-center px-4 py-3">
									<p className="text-base font-semibold text-[#001830]">{u.nombreCompleto}</p>
									<p className="text-sm text-[#1e293b]">{u.email || "-"}</p>
									<p className="text-sm text-[#1e293b]">{u.rol || "-"}</p>
									<div className="flex justify-center">
										<button
											onClick={() => setExpandidoId((prev) => (prev === u.id ? null : u.id))}
											className="flex h-8 w-8 items-center justify-center rounded-md border border-[#cdd6e1] text-lg font-semibold text-[#015cb9] transition-colors hover:bg-[#eef5fd]"
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
