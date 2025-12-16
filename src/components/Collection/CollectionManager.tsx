'use client';

import { ChevronsUpDown, Plus } from 'lucide-react';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useState } from 'react';
import { createNode } from '@/lib/graphql/nodes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export interface Collection
{
	id: string;
	name: string;
}

interface CollectionsProps
{
	initialCollections: Collection[];
}

export default function CollectionManager({ initialCollections }: CollectionsProps)
{
	const [collections, setCollections] = useState<Collection[]>(initialCollections);
	const [activeCollection, setActiveCollection] = useState<Collection>(initialCollections[0]);

	const { isMobile } = useSidebar();
	const router = useRouter();

	async function addCollection()
	{
		const node = await createNode(
			{
				data: {
					name: 'New Collection',
					type: 'folder',
				},
			},
			{
				id: true,
				name: true,
			},
		);

		const newCollection = { id: node.id, name: node.name, logo: null };
		setCollections((p) => [...p, newCollection]);
		setActiveCollection(newCollection);

		router.refresh();
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"></div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{activeCollection.name}</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" align="start" side={isMobile ? 'bottom' : 'right'} sideOffset={4}>
						<DropdownMenuLabel className="text-muted-foreground text-xs">Collections</DropdownMenuLabel>

						{collections.map((collection) => (
							<DropdownMenuItem key={collection.id} onClick={() => setActiveCollection(collection)} className="gap-2 p-2">
								<div className="flex size-6 items-center justify-center rounded-md border" />
								{collection.name}
							</DropdownMenuItem>
						))}

						<DropdownMenuSeparator />

						<DropdownMenuItem className="gap-2 p-2" onClick={addCollection}>
							<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
								<Plus className="size-4" />
							</div>
							<div className="text-muted-foreground font-medium">Add Collection</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
