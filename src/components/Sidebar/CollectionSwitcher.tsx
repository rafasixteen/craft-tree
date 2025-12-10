'use client';

import { ChevronsUpDown, Plus } from 'lucide-react';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CollectionSwitcherProps
{
	collections: {
		name: string;
		logo: React.ElementType | null;
		plan: string;
	}[];
}

export function CollectionSwitcher({ collections }: CollectionSwitcherProps)
{
	const { isMobile } = useSidebar();
	const [activeCollection, setActiveCollection] = useState(collections[0]);

	if (!activeCollection)
	{
		return null;
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
								{activeCollection.logo && <activeCollection.logo className="size-4" />}
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{activeCollection.name}</span>
								<span className="truncate text-xs">{activeCollection.plan}</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" align="start" side={isMobile ? 'bottom' : 'right'} sideOffset={4}>
						<DropdownMenuLabel className="text-muted-foreground text-xs">Collections</DropdownMenuLabel>
						{collections.map((collection, index) => (
							<DropdownMenuItem key={collection.name} onClick={() => setActiveCollection(collection)} className="gap-2 p-2">
								<div className="flex size-6 items-center justify-center rounded-md border">
									{collection.logo && <collection.logo className="size-3.5 shrink-0" />}
								</div>
								{collection.name}
								<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem className="gap-2 p-2">
							<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
								<Plus className="size-4" />
							</div>
							<div className="text-muted-foreground font-medium">Add Collection</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
