import { Navbar } from '@components/Navbar';
import ThemeToggle from '@components/ThemeToggle';

export default function Header()
{
	return (
		<header className="flex items-center justify-between px-4 py-2 border-b">
			<Navbar />
			<ThemeToggle />
		</header>
	);
}
