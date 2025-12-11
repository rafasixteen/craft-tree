'use client';

import { ChevronRight, File, Folder } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SearchBar } from '@components/Sidebar';
import { NavUser } from './NavUser';
import { CollectionSwitcher } from './CollectionSwitcher';
import { ItemTreeV2 } from '@/components/Items';
import { useState } from 'react';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarHeader,
	SidebarFooter,
} from '@/components/ui/sidebar';

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>)
{
	const [searchValue, setSearchValue] = useState('');

	return (
		<Sidebar {...props}>
			<SidebarHeader className="h-32 border-b flex justify-center">
				<CollectionSwitcher collections={[{ name: 'Craft Tree', logo: null, plan: 'Pro' }]} />
				<SearchBar value={searchValue} onChange={setSearchValue} />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Items</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<ItemTreeV2 searchValue={searchValue} />
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="h-16 border-t">
				<NavUser user={{ name: 'John Doe', email: 'john.doe@example.com', avatar: '/path/to/avatar.jpg' }} />
			</SidebarFooter>
		</Sidebar>
	);
}
