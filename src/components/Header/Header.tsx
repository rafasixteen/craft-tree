import ThemeToggle from '@components/ThemeToggle';
import { SidebarTrigger } from '../ui/sidebar';

export default function Header()
{
	return (
		<header className="flex items-center px-4 py-2 border-b justify-between h-16">
			<SidebarTrigger />
			<ThemeToggle />
		</header>
	);
}
