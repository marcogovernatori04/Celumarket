import { twDetalleCelular } from "../../styles/tw";

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
		<div className={twDetalleCelular.detailGalleryWrap}>
			<img
				key={imagenesActivas[imagenActiva] ?? "placeholder"}
				src={imagenesActivas[imagenActiva] ?? "https://placehold.co/500x500"}
				alt={nombre}
				className={twDetalleCelular.detailGalleryImage}
			/>
			{imagenesActivas.length > 1 && (
				<>
					<button
						onClick={onPrev}
						className={`${twDetalleCelular.detailGalleryArrow} left-3`}
					>
						‹
					</button>
					<button
						onClick={onNext}
						className={`${twDetalleCelular.detailGalleryArrow} right-3`}
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
							className={`${twDetalleCelular.detailGalleryDot} ${idx === imagenActiva ? "bg-[#015cb9]" : "bg-[#b9c3d1]"}`}
						/>
					))}
				</div>
			)}
		</div>
	);
};
