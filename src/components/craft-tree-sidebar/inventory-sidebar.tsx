import Link from 'next/link';
import { FactoryIcon, HomeIcon, PackageIcon, TagsIcon, WaypointsIcon } from 'lucide-react';
import { NavUser } from '@/components/user';
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
				<Link href="/">
					<SidebarMenuButton>
						<HomeIcon />
						<span>Home</span>
					</SidebarMenuButton>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<NavigationGroup />
				<InventoryGroup inventoryId={inventoryId} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

function NavigationGroup()
{
	return (
		<SidebarGroup>
			<SidebarGroupLabel>General</SidebarGroupLabel>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton tooltip="Inventories" asChild>
						<Link href="/inventories">
							<PackageIcon />
							<span>Inventories</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
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
				<SidebarMenuItem>
					<SidebarMenuButton tooltip="Production Graphs" asChild>
						<Link href={`/inventories/${inventoryId}/production-graphs`}>
							<WaypointsIcon />
							<span>Production Graphs</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}
