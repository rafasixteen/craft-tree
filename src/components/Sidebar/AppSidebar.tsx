'use client';

import { Collections, Collection } from '@components/Collection';
import { SearchBar } from '@components/Sidebar';
import { NavUser } from './NavUser';
import { ItemTree } from '@/components/Items';
import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>)
{
	const [searchValue, setSearchValue] = useState('');

	const [activeCollection, setActiveCollection] = useState<Collection | null>(null);
	const [hasCollections, setHasCollections] = useState(true);

	return (
		<Sidebar {...props}>
			<SidebarHeader className="h-32 border-b flex justify-center">
				<Collections onCollectionsChange={setHasCollections} onActiveCollectionChange={setActiveCollection} />
				{hasCollections && <SearchBar value={searchValue} onChange={setSearchValue} />}
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Items</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<ItemTree searchValue={searchValue} activeCollection={activeCollection} />
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
