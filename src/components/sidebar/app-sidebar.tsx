import { NavUser } from '@/components/user';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarRail,
} from '@/components/ui/sidebar';

import Link from 'next/link';

interface AppSidebar extends React.ComponentProps<typeof Sidebar>
{
	children?: React.ReactNode;
}

export function AppSidebar({ children, ...props }: AppSidebar)
{
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className="flex flex-row items-center justify-between">
				<SidebarMenu>
					<SidebarMenuButton
						size="lg"
						className="items-center hover:bg-transparent active:bg-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg">
							<Link href="/" className="flex items-center gap-2">
								<span>CT</span>
							</Link>
						</div>
						<div className="grid flex-1 text-left text-sm/tight">
							<Link href="/" className="flex w-fit items-center gap-2">
								<span className="truncate font-medium">Craft Tree</span>
							</Link>
						</div>
					</SidebarMenuButton>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>{children}</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
