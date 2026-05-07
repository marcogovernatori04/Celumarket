type NavbarLoginProps = {
	onIrAInicio?: () => void;
};

export const NavbarLogin = ({ onIrAInicio }: NavbarLoginProps) => {
	return (
		<nav className="h-[70px] border-b border-[#d9d9d9] bg-[#E6EAEF]">
			<div className="mx-auto flex h-full max-w-[1440px] items-center justify-center px-6">
				<img src="/logo.svg" alt="Celumarket" onClick={onIrAInicio} className="h-8 w-auto cursor-pointer" />
			</div>
		</nav>
	);
};
