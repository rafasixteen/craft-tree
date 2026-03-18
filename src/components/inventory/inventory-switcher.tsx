'use client';

import { useCurrentInventory } from '@/components/inventory';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useInventories } from '@/domain/inventory';

import Link from 'next/link';
import { ChevronsUpDown, Plus } from 'lucide-react';

export function InventorySwitcher()
{
	const { isMobile } = useSidebar();

	const { inventories } = useInventories();
	const inventory = useCurrentInventory();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								<p>{inventory.name.substring(0, 2).toUpperCase()}</p>
							</div>
							<div className="grid flex-1 text-left text-sm/tight">
								<span className="truncate font-medium">{inventory.name}</span>
								<span className="truncate text-xs">{inventory.id}</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						align="start"
						side={isMobile ? 'bottom' : 'right'}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-xs text-muted-foreground">Inventories</DropdownMenuLabel>
						{inventories.map((inventory) => (
							<Link href={`/inventories/${inventory.id}/items`} key={inventory.id}>
								<DropdownMenuItem className="gap-2 p-2">
									<div className="flex size-7 items-center justify-center rounded-md border">
										<p>{inventory.name.substring(0, 2).toUpperCase()}</p>
									</div>
									{inventory.name}
								</DropdownMenuItem>
							</Link>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem className="gap-2 p-2">
							<Link href="/inventories/create" className="flex items-center gap-2">
								<div className="flex size-7 items-center justify-center rounded-md border bg-transparent">
									<Plus className="size-4" />
								</div>
								<div className="font-medium text-muted-foreground">Create inventory</div>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
