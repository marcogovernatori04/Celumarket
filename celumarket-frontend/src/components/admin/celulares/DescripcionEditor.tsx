import { useState } from "react";

type DescripcionEditorProps = {
	celularId: number;
	descripcion: string;
	onGuardar: (descripcion: string) => Promise<void>;
};

export const DescripcionEditor = ({ celularId, descripcion, onGuardar }: DescripcionEditorProps) => {
	const [editandoCelularId, setEditandoCelularId] = useState<number | null>(null);
	const [draftDescripcion, setDraftDescripcion] = useState("");
	const [guardandoCelularId, setGuardandoCelularId] = useState<number | null>(null);

	const comenzarEdicion = () => {
		setEditandoCelularId(celularId);
		setDraftDescripcion(descripcion ?? "");
	};

	const cancelar = () => {
		setEditandoCelularId(null);
		setDraftDescripcion("");
	};

	const guardar = async () => {
		if (!draftDescripcion.trim()) return;
		try {
			setGuardandoCelularId(celularId);
			await onGuardar(draftDescripcion.trim());
			cancelar();
		} finally {
			setGuardandoCelularId(null);
		}
	};

	return (
		<div>
			<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">Descripción</p>
			{editandoCelularId === celularId ? (
				<div className="mt-2">
					<textarea
						value={draftDescripcion}
						onChange={(e) => setDraftDescripcion(e.target.value)}
						rows={3}
						className="w-full rounded-md border border-[#cdd6e1] bg-white px-3 py-2 text-sm text-[#334155]"
					/>
					<div className="mt-2 flex gap-2">
						<button
							onClick={() => void guardar()}
							disabled={guardandoCelularId === celularId}
							className="h-8 rounded bg-[#015cb9] px-3 text-xs font-semibold text-white hover:bg-[#017AF4] disabled:opacity-60"
						>
							Guardar descripción
						</button>
						<button
							onClick={cancelar}
							className="h-8 rounded border border-[#cdd6e1] bg-white px-3 text-xs font-semibold text-[#334155] hover:bg-[#f8fafc]"
						>
							Cancelar
						</button>
					</div>
				</div>
			) : (
				<div className="mt-1 flex items-start justify-between gap-3">
					<p className="text-sm text-[#334155]">{descripcion}</p>
					<button
						onClick={comenzarEdicion}
						className="h-8 whitespace-nowrap rounded border border-[#cdd6e1] bg-white px-3 text-xs font-semibold text-[#334155] hover:bg-[#f8fafc]"
					>
						Editar descripción
					</button>
				</div>
			)}
		</div>
	);
};
