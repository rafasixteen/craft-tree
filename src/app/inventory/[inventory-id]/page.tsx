'use client';

import { useActiveInventory } from '@/components/inventory';
import { ThemeToggle } from '@/components/theme-toggle';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { notFound } from 'next/navigation';

export default function InventoryPage()
{
	const { open } = useSidebar();

	const inventory = useActiveInventory();

	if (!inventory)
	{
		return notFound();
	}

	return (
		<>
			<header className={cn('sticky top-0 flex shrink-0 items-center border-b bg-background px-4', open ? 'h-16' : 'h-12', 'transition-[height] duration-300')}>
				<SidebarTrigger />
				<ThemeToggle className="ml-auto" variant="ghost" size="icon-sm" />
			</header>
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="grid auto-rows-min gap-4 md:grid-cols-6">
					{Array.from({ length: 200 }).map((_, i) => (
						<div key={i} className="aspect-square rounded-xl bg-muted/50" />
					))}
				</div>
			</div>
		</>
	);
}
