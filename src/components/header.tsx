import { ThemeToggle } from '@/components/theme-toggle';
import { Navbar } from '@/components/navbar';

export function Header()
{
	return (
		<header className="flex items-center px-4 py-2 border-b justify-between h-16">
			<Navbar />
			<ThemeToggle />
		</header>
	);
}
