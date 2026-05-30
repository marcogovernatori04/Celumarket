import { useState } from "react";
import type { EspecificacionDetalle } from "../../../models/CelularDetalle";
import { twBase } from "../../../styles/tw";

type EspecificacionesEditorProps = {
	celularId: number;
	especificaciones: EspecificacionDetalle[];
	onGuardar: (especificaciones: Array<{ nombre: string; valor: string }>) => Promise<void>;
};

export const EspecificacionesEditor = ({ celularId, especificaciones, onGuardar }: EspecificacionesEditorProps) => {
	const [editandoCelularId, setEditandoCelularId] = useState<number | null>(null);
	const [draft, setDraft] = useState<Array<{ nombre: string; valor: string }>>([]);
	const [guardandoCelularId, setGuardandoCelularId] = useState<number | null>(null);

	const comenzarEdicion = () => {
		setEditandoCelularId(celularId);
		setDraft(especificaciones.map((e) => ({ nombre: e.nombre, valor: e.valor })));
	};

	const cancelar = () => {
		setEditandoCelularId(null);
		setDraft([]);
	};

	const guardar = async () => {
		try {
			setGuardandoCelularId(celularId);
			const payload = draft
				.map((e) => ({ nombre: e.nombre.trim(), valor: e.valor.trim() }))
				.filter((e) => e.nombre.length > 0 && e.valor.length > 0);
			await onGuardar(payload);
			cancelar();
		} finally {
			setGuardandoCelularId(null);
		}
	};

	return (
		<div>
			<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">Especificaciones</p>
			{editandoCelularId === celularId ? (
				<div className="mt-2 space-y-2">
					{draft.map((esp, index) => (
						<div key={`esp-edit-${index}`} className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
							<input
								value={esp.nombre}
								onChange={(e) => setDraft((prev) => prev.map((x, i) => i === index ? { ...x, nombre: e.target.value } : x))}
								placeholder="Nombre"
								className="h-9 min-w-0 rounded border border-[#cdd6e1] bg-white px-2 text-sm"
							/>
							<input
								value={esp.valor}
								onChange={(e) => setDraft((prev) => prev.map((x, i) => i === index ? { ...x, valor: e.target.value } : x))}
								placeholder="Valor"
								className="h-9 min-w-0 rounded border border-[#cdd6e1] bg-white px-2 text-sm"
							/>
							<button
								onClick={() => setDraft((prev) => prev.filter((_, i) => i !== index))}
								className={`${twBase.actionBtnDanger} w-full sm:w-auto`}
							>
								Quitar
							</button>
						</div>
					))}
					<button
						onClick={() => setDraft((prev) => [...prev, { nombre: "", valor: "" }])}
						className={`${twBase.actionBtnNeutral} w-full sm:w-auto`}
					>
						+ Añadir especificación
					</button>
					<div className="flex flex-col gap-2 sm:flex-row">
						<button
							onClick={() => void guardar()}
							disabled={guardandoCelularId === celularId}
							className={`${twBase.actionBtnPrimary} w-full sm:w-auto`}
						>
							Guardar especificaciones
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
				<div className="mt-2">
					<div className="grid gap-2 sm:grid-cols-2">
						{especificaciones.map((esp) => (
							<div key={`${esp.nombre}-${esp.valor}`} className="rounded-md border border-[#dbe4ef] bg-white px-3 py-2 text-sm text-[#334155]">
								<span className="font-semibold text-[#001830]">{esp.nombre}:</span> {esp.valor}
							</div>
						))}
					</div>
					<button
						onClick={comenzarEdicion}
						className={`mt-2 ${twBase.actionBtnNeutral}`}
					>
						Editar especificaciones
					</button>
				</div>
			)}
		</div>
	);
};
