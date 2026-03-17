import { ThemeToggle } from '@/components/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface HeaderProps
{
	children?: React.ReactNode;
}

export function Header({ children }: HeaderProps)
{
	return (
		<header className="sticky top-0 flex h-16 shrink-0 items-center border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
			<SidebarTrigger />
			<Separator orientation="vertical" className={cn('mx-4 my-auto h-8', 'group-data-[state=collapsed]/sidebar-wrapper:h-6')} />
			{children}
			<ThemeToggle className="ml-auto" variant="ghost" size="icon-sm" />
		</header>
	);
}
