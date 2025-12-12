'use client';

import { SearchBar, CollectionSwitcher, Collection } from '@components/Sidebar';
import { NavUser } from './NavUser';
import { ItemTreeV2 } from '@/components/Items';
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
				<CollectionSwitcher onCollectionsChange={setHasCollections} onActiveCollectionChange={setActiveCollection} />
				{hasCollections && <SearchBar value={searchValue} onChange={setSearchValue} />}
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Items</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<ItemTreeV2 searchValue={searchValue} activeCollection={activeCollection} />
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
