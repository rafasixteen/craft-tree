'use client';

import Link from 'next/link';
import { ArrowLeftFromLineIcon, ArrowRightFromLineIcon, FactoryIcon, PackageIcon, TagsIcon } from 'lucide-react';
import { NavUser } from '@/components/user';
import { InventorySwitcher, useActiveInventory } from '@/components/inventory';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { use } from 'react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>)
{
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<InventorySwitcher />
			</SidebarHeader>
			<SidebarContent>
				<InventoryGroup />
				<DocumentsGroup />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

function InventoryGroup()
{
	const inventory = useActiveInventory();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Inventory</SidebarGroupLabel>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton tooltip="Items" asChild>
						<Link href={`/inventory/${inventory.id}/items`}>
							<PackageIcon />
							<span>Items</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarMenuButton tooltip="Producers" asChild>
						<Link href={`/inventory/${inventory.id}/producers`}>
							<FactoryIcon />
							<span>Producers</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarMenuButton tooltip="Tags" asChild>
						<Link href={`/inventory/${inventory.id}/tags`}>
							<TagsIcon />
							<span>Tags</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}

function DocumentsGroup()
{
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Documents</SidebarGroupLabel>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton tooltip="Import" asChild>
						<Link href="/inventory/import">
							<ArrowRightFromLineIcon />
							<span>Import</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarMenuButton tooltip="Export" asChild>
						<Link href="/inventory/export">
							<ArrowLeftFromLineIcon />
							<span>Export</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}
