import Link from 'next/link';
import { ArrowLeftFromLineIcon, ArrowRightFromLineIcon, FactoryIcon, PackageIcon, TagsIcon, WaypointsIcon } from 'lucide-react';
import { NavUser } from '@/components/user';
import { InventorySwitcher } from '@/components/inventory';
import { Inventory } from '@/domain/inventory';
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

interface InventorySidebarProps extends React.ComponentProps<typeof Sidebar>
{
	inventoryId: Inventory['id'];
}

export function InventorySidebar({ inventoryId, ...props }: InventorySidebarProps)
{
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<InventorySwitcher />
			</SidebarHeader>
			<SidebarContent>
				<InventoryGroup inventoryId={inventoryId} />
				<ProductionGraphGroup inventoryId={inventoryId} />
				<DocumentsGroup />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

function InventoryGroup({ inventoryId }: { inventoryId: Inventory['id'] })
{
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Inventory</SidebarGroupLabel>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton tooltip="Items" asChild>
						<Link href={`/inventories/${inventoryId}/items`}>
							<PackageIcon />
							<span>Items</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarMenuButton tooltip="Producers" asChild>
						<Link href={`/inventories/${inventoryId}/producers`}>
							<FactoryIcon />
							<span>Producers</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarMenuButton tooltip="Tags" asChild>
						<Link href={`/inventories/${inventoryId}/tags`}>
							<TagsIcon />
							<span>Tags</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}

function ProductionGraphGroup({ inventoryId }: { inventoryId: Inventory['id'] })
{
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Production Graph</SidebarGroupLabel>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton tooltip="Import" asChild>
						<Link href={`/inventories/${inventoryId}/production-graph`}>
							<WaypointsIcon />
							<span>Production Graph</span>
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
						<Link href="/inventories/import">
							<ArrowRightFromLineIcon />
							<span>Import</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarMenuButton tooltip="Export" asChild>
						<Link href="/inventories/export">
							<ArrowLeftFromLineIcon />
							<span>Export</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}
