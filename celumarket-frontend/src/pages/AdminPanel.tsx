export const AdminPanel = () => {
	return (
		<div className="mx-auto w-full max-w-[1080px] px-6 py-10">
			<h1 className="text-3xl font-extrabold text-[#001830]">Panel Admin</h1>
			<div className="mt-6 rounded-xl border border-black/10 bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.07)]">
				<p className="text-[18px] font-semibold text-[#001830]">Acceso administrador habilitado</p>
				<p className="mt-2 text-[#5b6673]">
					Este usuario tiene rol Admin. En el siguiente paso conectamos los módulos ABM.
				</p>
			</div>
		</div>
	);
};
