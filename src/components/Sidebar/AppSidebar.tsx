'use server';

import { CollectionsLoader, CollectionManager } from '@components/Collection';
import { NavUser } from './NavUser';
import { ItemTree } from '@/components/Items';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';

export default async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>)
{
	const collections = await CollectionsLoader();

	return (
		<Sidebar {...props}>
			<SidebarHeader className="h-32 border-b flex justify-center">
				<CollectionManager initialCollections={collections} />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Items</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<ItemTree collection={collections[0]} />
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
