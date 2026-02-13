'use client';

import { ChevronsUpDown, Plus } from 'lucide-react';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useInventories } from '@/domain/inventory';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { notFound } from 'next/navigation';
import { useActiveInventory } from '@/components/inventory';
import Link from 'next/link';

export function InventorySwitcher()
{
	const { isMobile } = useSidebar();

	const { inventories } = useInventories();
	const activeInventory = useActiveInventory();

	if (!activeInventory)
	{
		return notFound();
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								<p>{activeInventory.name.substring(0, 2).toUpperCase()}</p>
							</div>
							<div className="grid flex-1 text-left text-sm/tight">
								<span className="truncate font-medium">{activeInventory.name}</span>
								<span className="truncate text-xs">{activeInventory.id}</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" align="start" side={isMobile ? 'bottom' : 'right'} sideOffset={4}>
						<DropdownMenuLabel className="text-xs text-muted-foreground">Inventories</DropdownMenuLabel>
						{inventories.map((inventory) => (
							<Link href={`/inventory/${inventory.id}`} key={inventory.id}>
								<DropdownMenuItem className="gap-2 p-2">
									<div className="flex size-7 items-center justify-center rounded-md border">
										<p>{activeInventory.name.substring(0, 2).toUpperCase()}</p>
									</div>
									{inventory.name}
								</DropdownMenuItem>
							</Link>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem className="gap-2 p-2">
							<div className="flex size-7 items-center justify-center rounded-md border bg-transparent">
								<Plus className="size-4" />
							</div>
							<div className="font-medium text-muted-foreground">Add inventory</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
