import { Navbar, ThemeToggle } from '@/components/layout';
import { User } from '@/components/auth';

export function Header()
{
	return (
		<header className="sticky top-0 z-50 flex h-auto min-h-14 items-center justify-between border-b bg-background px-4 py-2 md:min-h-16">
			<Navbar />
			<div className="flex items-center gap-4">
				<ThemeToggle />
				<User />
			</div>
		</header>
	);
}
