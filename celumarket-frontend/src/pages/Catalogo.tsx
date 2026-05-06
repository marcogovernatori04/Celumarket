import { useEffect, useState } from "react";
import { TarjetaCelular, type ProductoCelular } from "../components/TarjetaCelular";
import { Footer } from "../components/Footer";
import { api } from "../services/api";

type CatalogoItem = {
	id: number;
	marca: string;
	modelo: string;
	precioMinimo: number;
	cantidadColores: number;
	urlImagenPrincipal: string;
};

type CatalogoPaginado = {
	items: CatalogoItem[];
	totalItems: number;
	paginaActual: number;
	totalPaginas: number;
};

export const Catalogo = () => {
	const [productos, setProductos] = useState<ProductoCelular[]>([]);
	const [pagina, setPagina] = useState(1);
	const [totalPaginas, setTotalPaginas] = useState(1);
	const [cargando, setCargando] = useState(true);
	const [busqueda, setBusqueda] = useState("");
	const [filtro, setFiltro] = useState<"nuevo" | "precio-asc" | "precio-desc">("nuevo");

	useEffect(() => {
		const cargar = async () => {
			setCargando(true);
			const { data } = await api.get<CatalogoPaginado>(`/Celulares?pag=${pagina}&cant=10`);
			setTotalPaginas(data.totalPaginas || 1);
			setProductos(
				data.items.map((item) => ({
					id: item.id,
					nombre: `${item.marca} ${item.modelo}`,
					precio: item.precioMinimo,
					precioAnterior: null,
					colores: item.cantidadColores,
					imagen: item.urlImagenPrincipal,
					descuentoTexto: "10% descuento efectivo/transferencia",
				})),
			);
			setCargando(false);
		};
		void cargar();
	}, [pagina]);

	const productosFiltrados = productos
		.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
		.sort((a, b) => {
			if (filtro === "precio-asc") return a.precio - b.precio;
			if (filtro === "precio-desc") return b.precio - a.precio;
			return 0;
		});

	return (
		<div className="min-h-screen bg-[#f5f5f5]">
			<section className="px-10 py-8">
				<div className="mx-auto mb-8 max-w-6xl flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="relative w-full lg:max-w-[420px]">
						<input
							value={busqueda}
							onChange={(e) => setBusqueda(e.target.value)}
							placeholder="Buscar..."
							className="h-11 w-full rounded-full border border-[#d9d9d9] bg-white pl-4 pr-10 text-sm text-[#1e1e1e] outline-none"
						/>
						<span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">⌕</span>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<button onClick={() => setFiltro("nuevo")} className={`rounded px-3 py-2 text-sm transition-colors ${filtro === "nuevo" ? "bg-[#001830] text-white hover:bg-[#012a55]" : "bg-[#f0f0f0] text-[#757575] hover:bg-[#e5e5e5] hover:text-[#1e1e1e]"}`}>Nuevo</button>
						<button onClick={() => setFiltro("precio-asc")} className={`rounded px-3 py-2 text-sm transition-colors ${filtro === "precio-asc" ? "bg-[#001830] text-white hover:bg-[#012a55]" : "bg-[#f0f0f0] text-[#757575] hover:bg-[#e5e5e5] hover:text-[#1e1e1e]"}`}>Precio ascendente</button>
						<button onClick={() => setFiltro("precio-desc")} className={`rounded px-3 py-2 text-sm transition-colors ${filtro === "precio-desc" ? "bg-[#001830] text-white hover:bg-[#012a55]" : "bg-[#f0f0f0] text-[#757575] hover:bg-[#e5e5e5] hover:text-[#1e1e1e]"}`}>Precio descendente</button>
					</div>
				</div>
				{cargando ? (
					<p className="text-center text-gray-500">Cargando catálogo...</p>
				) : (
					<div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
						{productosFiltrados.map((prod) => (
							<TarjetaCelular key={prod.id} producto={prod} />
						))}
					</div>
				)}
				<div className="mx-auto mt-8 flex max-w-6xl items-center justify-center gap-3">
					<button disabled={pagina === 1} onClick={() => setPagina((p) => p - 1)} className="rounded bg-[#001830] px-3 py-2 text-white disabled:opacity-40">Anterior</button>
					<span className="text-sm text-gray-700">Página {pagina} de {totalPaginas}</span>
					<button disabled={pagina >= totalPaginas} onClick={() => setPagina((p) => p + 1)} className="rounded bg-[#001830] px-3 py-2 text-white disabled:opacity-40">Siguiente</button>
				</div>
			</section>
			<Footer />
		</div>
	);
};
