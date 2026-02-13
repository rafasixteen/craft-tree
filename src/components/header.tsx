import { ThemeToggle } from '@/components/theme-toggle';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface HeaderProps
{
	children?: React.ReactNode;
}

export function Header({ children }: HeaderProps)
{
	const { open } = useSidebar();

	return (
		<header className={cn('sticky top-0 flex shrink-0 items-center border-b bg-background px-4', open ? 'h-16' : 'h-12', 'transition-[height] duration-300')}>
			<SidebarTrigger />
			<Separator orientation="vertical" className={cn('mx-4 my-auto', open ? 'h-8' : 'h-6')} />
			{children}
			<ThemeToggle className="ml-auto" variant="ghost" size="icon-sm" />
		</header>
	);
}
