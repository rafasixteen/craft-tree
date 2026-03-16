import Link from 'next/link';
import { NavUser } from '@/components/user';
import { HomeIcon } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton, SidebarRail } from '@/components/ui/sidebar';

export function InventoriesSidebar(props: React.ComponentProps<typeof Sidebar>)
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
			<SidebarContent></SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
