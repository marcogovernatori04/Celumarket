import { useState } from "react";
import { Footer } from "../components/Footer";

export const Contacto = () => {
	const [nombre, setNombre] = useState("");
	const [email, setEmail] = useState("");
	const [asunto, setAsunto] = useState("");
	const [mensaje, setMensaje] = useState("");
	const [enviado, setEnviado] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const enviar = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		if (!nombre.trim() || !email.trim() || !asunto.trim() || !mensaje.trim()) {
			setError("Completa todos los campos.");
			return;
		}
		setEnviado(true);
		setNombre("");
		setEmail("");
		setAsunto("");
		setMensaje("");
	};

	return (
		<div className="h-[calc(100dvh-72px)] bg-[#f5f5f5] flex flex-col overflow-hidden">
			<section className="mx-auto flex w-full max-w-5xl min-h-0 flex-1 items-center px-6 py-3">
				<div className="w-full">
				<h1 className="text-3xl font-bold text-[#001830]">Contacto</h1>
				<p className="mt-1 text-[#475569]">¿Tienes dudas? Envíanos tu consulta y te respondemos a la brevedad.</p>

				<div className="mt-3 rounded-xl border border-black/10 bg-white p-3.5 shadow-sm">
					<form onSubmit={enviar} className="space-y-2">
						<div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
							<input
								value={nombre}
								onChange={(e) => setNombre(e.target.value)}
								placeholder="Nombre y apellido"
								className="h-10 rounded-lg border border-[#d5dde6] px-3 text-[15px]"
							/>
							<input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								type="email"
								placeholder="Email"
								className="h-10 rounded-lg border border-[#d5dde6] px-3 text-[15px]"
							/>
						</div>
						<input
							value={asunto}
							onChange={(e) => setAsunto(e.target.value)}
							placeholder="Asunto"
							className="h-10 w-full rounded-lg border border-[#d5dde6] px-3 text-[15px]"
						/>
						<textarea
							value={mensaje}
							onChange={(e) => setMensaje(e.target.value)}
							placeholder="Escribe tu mensaje"
							rows={3}
							className="w-full rounded-lg border border-[#d5dde6] px-3 py-2 text-[15px]"
						/>

						{error && <p className="text-sm text-[#b42318]">{error}</p>}
						{enviado && <p className="text-sm text-[#1E8E5A]">Mensaje enviado. Te responderemos pronto.</p>}

						<button
							type="submit"
							className="h-10 rounded-lg bg-[#015cb9] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#017AF4]"
						>
							Enviar consulta
						</button>
					</form>
				</div>
				</div>
			</section>
			<Footer />
		</div>
	);
};
