'use client';

import { ChevronsUpDown, Plus } from 'lucide-react';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { createNode, getRootNodes } from '@/lib/graphql/nodes';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// TODO: Once we have login implemented, before allowing the user to go the the main page
// we should check if they have any collections. If not, we should force them to create one.
// with a big "Empty" component from shadcn.

// Or just automatically create a default collection and show a little tutorial on first launch.

export interface Collection
{
	id: string;
	name: string;
	logo: React.ElementType | null;
}

interface CollectionsProps
{
	onCollectionsChange?: (hasCollections: boolean) => void;
	onActiveCollectionChange?: (collection: Collection | null) => void;
}

export default function Collections({ onCollectionsChange, onActiveCollectionChange }: CollectionsProps)
{
	const { isMobile } = useSidebar();
	const [collections, setCollections] = useState<Collection[]>([]);
	const [activeCollection, setActiveCollection] = useState<Collection | null>(null);
	const [loading, setLoading] = useState(true);

	const [open, setOpen] = useState(false);
	const [newName, setNewName] = useState('');

	useEffect(() =>
	{
		async function fetchRootNodes()
		{
			const roots = await getRootNodes(['id', 'name']);
			const mapped = roots.map((root) => ({ id: root.id, name: root.name, logo: null }));

			setCollections(mapped);
			if (mapped.length > 0) setActiveCollection(mapped[0]);

			setLoading(false);
		}

		fetchRootNodes();
	}, []);

	useEffect(() =>
	{
		if (!open) setNewName('');
	}, [open]);

	useEffect(() =>
	{
		if (onCollectionsChange)
		{
			onCollectionsChange(collections.length > 0);
		}
	}, [collections, onCollectionsChange]);

	useEffect(() =>
	{
		if (onActiveCollectionChange)
		{
			onActiveCollectionChange(activeCollection);
		}
	}, [activeCollection, onActiveCollectionChange]);

	async function createCollection()
	{
		const node = await createNode({
			data: {
				name: newName,
				type: 'folder',
			},
		});

		const newCollection = { id: node.id, name: node.name, logo: null };
		setCollections((p) => [...p, newCollection]);
		setOpen(false);
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<Dialog open={open} onOpenChange={setOpen}>
					{!loading && collections.length === 0 ? (
						<SidebarMenu className="flex flex-col items-center justify-between gap-3 p-4 text-center">
							<p className="text-xs text-muted-foreground">No collections yet</p>
							<Button onClick={() => setOpen(true)}>
								<Plus className="mr-2 h-3 w-3" />
								Create Collection
							</Button>
						</SidebarMenu>
					) : (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
									{DisplayActiveCollection(activeCollection)}
									<ChevronsUpDown className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>

							<DropdownMenuContent
								className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
								align="start"
								side={isMobile ? 'bottom' : 'right'}
								sideOffset={4}
							>
								<DropdownMenuLabel className="text-muted-foreground text-xs">Collections</DropdownMenuLabel>

								{collections.map((collection) => (
									<DropdownMenuItem key={collection.id} onClick={() => setActiveCollection(collection)} className="gap-2 p-2">
										<div className="flex size-6 items-center justify-center rounded-md border">
											{collection.logo && <collection.logo className="size-3.5 shrink-0" />}
										</div>
										{collection.name}
									</DropdownMenuItem>
								))}

								<DropdownMenuSeparator />

								<DialogTrigger asChild>
									<DropdownMenuItem className="gap-2 p-2">
										<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
											<Plus className="size-4" />
										</div>
										<div className="text-muted-foreground font-medium">Add Collection</div>
									</DropdownMenuItem>
								</DialogTrigger>
							</DropdownMenuContent>
						</DropdownMenu>
					)}

					<DialogContent className="w-3xs min-w-3xs">
						<DialogHeader>
							<DialogTitle className="text-center">New Collection</DialogTitle>
						</DialogHeader>

						<Input value={newName} onChange={(e) => setNewName(e.target.value)} />

						<DialogFooter className="flex flex-row justify-end gap-2">
							<Button className="grow" variant="outline" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button className="grow" onClick={createCollection}>
								Create
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

function DisplayNoCollections()
{
	return <span>No collections yet</span>;
}

function DisplayActiveCollection(collection: Collection | null)
{
	if (collection)
	{
		return (
			<>
				<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
					{collection.logo && <collection.logo className="size-4" />}
				</div>
				<div className="grid flex-1 text-left text-sm leading-tight">
					<span className="truncate font-medium">{collection.name}</span>
				</div>
			</>
		);
	}
	return (
		<>
			<div className="bg-sidebar-secondary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
				<Skeleton className="size-6 rounded-lg" />
			</div>
			<div className="grid flex-1 text-left text-sm leading-tight">
				<Skeleton className="w-24 h-4 rounded" />
			</div>
		</>
	);
}
