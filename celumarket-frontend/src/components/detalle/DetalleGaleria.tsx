type DetalleGaleriaProps = {
	imagenesActivas: string[];
	imagenActiva: number;
	nombre: string;
	onSetImagenActiva: (idx: number) => void;
	onPrev: () => void;
	onNext: () => void;
};

export const DetalleGaleria = ({
	imagenesActivas,
	imagenActiva,
	nombre,
	onSetImagenActiva,
	onPrev,
	onNext,
}: DetalleGaleriaProps) => {
	return (
		<div className="relative flex h-[360px] sm:h-[400px] items-center justify-center overflow-hidden rounded-xl bg-[#f0f0f0] p-4">
			<img
				key={imagenesActivas[imagenActiva] ?? "placeholder"}
				src={imagenesActivas[imagenActiva] ?? "https://placehold.co/500x500"}
				alt={nombre}
				className="h-[82%] w-auto scale-[1.2] object-contain mix-blend-multiply animate-[fadeIn_260ms_ease-out]"
			/>
			{imagenesActivas.length > 1 && (
				<>
					<button
						onClick={onPrev}
						className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-1 text-lg text-[#001830] shadow transition-all duration-200 hover:scale-110 hover:bg-white hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#015cb9]"
					>
						‹
					</button>
					<button
						onClick={onNext}
						className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-1 text-lg text-[#001830] shadow transition-all duration-200 hover:scale-110 hover:bg-white hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#015cb9]"
					>
						›
					</button>
				</>
			)}
			{imagenesActivas.length > 1 && (
				<div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
					{imagenesActivas.map((_, idx) => (
						<button
							key={idx}
							onClick={() => onSetImagenActiva(idx)}
							className={`h-2.5 w-2.5 rounded-full ${idx === imagenActiva ? "bg-[#015cb9]" : "bg-[#b9c3d1]"}`}
						/>
					))}
				</div>
			)}
		</div>
	);
};
