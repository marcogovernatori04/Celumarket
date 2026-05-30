import { useState } from "react";
import { twBase } from "../../../styles/tw";

type DescripcionEditorProps = {
	celularId: number;
	descripcion: string;
	onGuardar: (descripcion: string) => Promise<void>;
};

export const DescripcionEditor = ({ celularId, descripcion, onGuardar }: DescripcionEditorProps) => {
	const [editandoCelularId, setEditandoCelularId] = useState<number | null>(null);
	const [draftDescripcion, setDraftDescripcion] = useState("");
	const [guardandoCelularId, setGuardandoCelularId] = useState<number | null>(null);
	const [descripcionExpandida, setDescripcionExpandida] = useState(false);
	const descripcionLarga = (descripcion ?? "").length > 180;

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
					<div className="mt-2 flex flex-col gap-2 sm:flex-row">
						<button
							onClick={() => void guardar()}
							disabled={guardandoCelularId === celularId}
							className={`${twBase.actionBtnPrimary} w-full sm:w-auto`}
						>
							Guardar descripción
						</button>
						<button
							onClick={cancelar}
							className={`${twBase.actionBtnCancel} w-full sm:w-auto`}
						>
							Cancelar
						</button>
					</div>
				</div>
			) : (
				<div className="mt-1 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
					<div className="min-w-0">
						<p className={`text-sm leading-relaxed text-[#334155] ${!descripcionExpandida && descripcionLarga ? "line-clamp-4" : ""}`}>
							{descripcion}
						</p>
						{descripcionLarga && (
							<button
								type="button"
								onClick={() => setDescripcionExpandida((expandida) => !expandida)}
								className="mt-1 text-xs font-semibold text-[#015cb9] hover:text-[#017AF4]"
							>
								{descripcionExpandida ? "Ver menos" : "Ver más"}
							</button>
						)}
					</div>
					<button
						onClick={comenzarEdicion}
						className={`${twBase.actionBtnNeutral} w-full whitespace-nowrap sm:w-auto`}
					>
						Editar descripción
					</button>
				</div>
			)}
		</div>
	);
};
