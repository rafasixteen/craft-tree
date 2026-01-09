'use server';

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { User } from '@/components/user';
import { auth, signIn, signOut } from '@/auth';

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>)
{
	const session = await auth();

	return (
		<Sidebar {...props}>
			<SidebarHeader className="h-16 border-b flex justify-center">
				{
					// <CollectionManager initialCollections={collections} />
				}
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Items</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{
								// <ItemTree collection={collections[0]} />
							}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="h-16 border-t justify-center">
				<User user={{ name: session?.user?.name ?? '', email: session?.user?.email ?? '', avatar: session?.user?.image ?? '' }} />
			</SidebarFooter>
		</Sidebar>
	);
}
