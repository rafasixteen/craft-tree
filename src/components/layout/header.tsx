import { Navbar, ThemeToggle } from '@/components/layout';
import { User } from '@/components/auth';

export function Header()
{
	return (
		<header className="flex items-center justify-between px-4 py-2 border-b h-16">
			<Navbar />
			<div className="flex items-center gap-4">
				<ThemeToggle />
				<User />
			</div>
		</header>
	);
}
