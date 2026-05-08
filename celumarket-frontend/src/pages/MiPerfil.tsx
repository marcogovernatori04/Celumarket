import { useEffect, useState } from "react";
import { clienteService, type MiPerfil as MiPerfilData } from "../services/clienteService";
import { Footer } from "../components/Footer";

export const MiPerfil = () => {
	const [perfil, setPerfil] = useState<MiPerfilData | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const cargar = async () => {
			try {
				const data = await clienteService.obtenerMiPerfil();
				setPerfil(data);
			} catch {
				setError("No se pudo cargar tu perfil.");
			}
		};
		void cargar();
	}, []);

	return (
		<div className="min-h-screen bg-[#f5f5f5] flex flex-col">
			<section className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
				<h1 className="mb-6 text-3xl font-bold text-[#001830]">Mi perfil</h1>
				{error && <p className="text-red-600">{error}</p>}
				{!error && !perfil && <p className="text-gray-600">Cargando perfil...</p>}
				{perfil && (
					<div className="rounded-lg bg-white p-6 shadow-sm space-y-5">
						<div>
							<p className="text-sm text-[#6b7280]">Nombre</p>
							<p className="text-lg font-semibold text-[#1e1e1e]">{perfil.nombreCompleto}</p>
						</div>
						<div>
							<p className="text-sm text-[#6b7280]">Email</p>
							<p className="text-lg text-[#1e1e1e]">{perfil.email ?? "—"}</p>
						</div>
						<div>
							<p className="text-sm text-[#6b7280]">Teléfono</p>
							<p className="text-lg text-[#1e1e1e]">{perfil.telefono ?? "—"}</p>
						</div>
						<div>
							<p className="text-sm text-[#6b7280]">DNI</p>
							<p className="text-lg text-[#1e1e1e]">{perfil.dni ?? "—"}</p>
						</div>
						<div>
							<p className="text-sm text-[#6b7280]">Dirección de envío</p>
							<p className="text-lg text-[#1e1e1e]">{perfil.direccionCompleta ?? "No tienes una dirección guardada todavía."}</p>
						</div>
					</div>
				)}
			</section>
			<Footer />
		</div>
	);
};
