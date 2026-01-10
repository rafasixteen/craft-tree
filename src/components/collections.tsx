'use client';

import { ChevronsUpDown, Plus, Wallet } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useIsMobile from '@/hooks/use-is-mobile';

export interface Collection
{
	id: string;
	name: string;
}

interface CollectionsProps
{
	collections: Collection[];
}

async function createNewCollection(): Promise<Collection>
{
	await new Promise((r) => setTimeout(r, 500));

	return {
		id: crypto.randomUUID(),
		name: 'New Collection',
	};
}

export function Collections({ collections }: CollectionsProps)
{
	const router = useRouter();
	const pathname = usePathname();

	const [isAdding, setIsAdding] = useState(false);
	const { isMobile } = useIsMobile();

	const segments = pathname.split('/').filter(Boolean);
	const activeCollectionId = segments[1];
	const activeCollection = collections.find((c) => c.id === activeCollectionId) ?? collections[0];

	useEffect(() =>
	{
		const targetPath = `/collections/${activeCollection.id}`;
		if (!pathname.startsWith(targetPath)) router.replace(targetPath);
	}, [activeCollection, pathname, router]);

	function setActiveCollection(collection: Collection)
	{
		router.push(`/collections/${collection.id}`);
	}

	async function addCollection()
	{
		try
		{
			setIsAdding(true);

			const newCollection = await createNewCollection();

			// Navigate to the new collection
			router.push(`/collections/${newCollection.id}`);

			// Re-fetch server components / loaders
			router.refresh();
		}
		finally
		{
			setIsAdding(false);
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="flex items-center gap-2 p-2 h-full w-full rounded-lg" variant="ghost">
					<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
						<Wallet className="size-4" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{activeCollection.name}</span>
						<span className="truncate text-xs">{activeCollection.id}</span>
					</div>
					<div>
						<ChevronsUpDown className="ml-auto size-4" />
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" align="start" side={isMobile ? 'bottom' : 'right'} sideOffset={4}>
				<DropdownMenuLabel className="text-muted-foreground text-xs">Collections</DropdownMenuLabel>
				{collections.map((collection) => (
					<DropdownMenuItem key={collection.id} className="gap-2 p-2" onClick={() => setActiveCollection(collection)}>
						{collection.name}
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem className="gap-2 p-2" onClick={addCollection} disabled={isAdding}>
					<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
						<Plus className="size-4" />
					</div>
					<div className="text-muted-foreground font-medium"> {isAdding ? 'Adding…' : 'Add collection'}</div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
