import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

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
