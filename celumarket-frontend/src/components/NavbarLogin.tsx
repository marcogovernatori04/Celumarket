import { twNav } from "../styles/tw";

type NavbarLoginProps = {
	onIrAInicio?: () => void;
};

export const NavbarLogin = ({ onIrAInicio }: NavbarLoginProps) => {
	return (
		<nav className={`h-[64px] sm:h-[70px] ${twNav.navShell}`}>
			<div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-center px-4 sm:px-6">
				<img src="/logo.svg" alt="Celumarket" onClick={onIrAInicio} className="h-7 w-auto cursor-pointer sm:h-8" />
			</div>
		</nav>
	);
};
