import Link from 'next/link';
import { NavUser } from '@/components/user';
import { ArrowLeftFromLineIcon, ArrowRightFromLineIcon, PackageIcon } from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar';

export function InventoriesSidebar(props: React.ComponentProps<typeof Sidebar>)
{
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenuButton>
					<PackageIcon />
					<Link href="/inventories">Inventories</Link>
				</SidebarMenuButton>
			</SidebarHeader>
			<SidebarContent>
				<DocumentsGroup />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
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
