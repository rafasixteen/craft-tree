import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

export interface NavItem
{
	label: string;
	href: string;
	icon: LucideIcon;
	tooltip?: string;
}

interface NavGroupProps
{
	label: string;
	items: NavItem[];
}

export function NavGroup({ label, items }: NavGroupProps)
{
	return (
		<SidebarGroup>
			<SidebarGroupLabel>{label}</SidebarGroupLabel>
			<SidebarMenu>
				{items.map(({ label, href, icon: Icon, tooltip }) => (
					<SidebarMenuItem key={href}>
						<SidebarMenuButton tooltip={tooltip ?? label} asChild>
							<Link href={href}>
								<Icon />
								<span>{label}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
