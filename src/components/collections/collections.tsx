'use client';

import { ChevronsUpDown, Plus, Wallet } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createCollection } from '@/domain/collection/services/create-collection';
import { Collection } from '@/domain/collection';
import { useCollectionsContext } from '@/providers/collections-context';

export function Collections()
{
	const router = useRouter();

	const { collections, activeCollection } = useCollectionsContext();
	const [isPending, startTransition] = useTransition();

	function setActiveCollection(collection: Collection)
	{
		router.push(`/collections/${collection.slug}`);
	}

	async function addCollection()
	{
		startTransition(async () =>
		{
			try
			{
				const newCollection = await createCollection({
					name: 'New Collection',
					userId: activeCollection.userId,
				});

				router.refresh();

				setActiveCollection(newCollection);
			}
			catch (err)
			{
				console.error('Failed to create collection:', err);
			}
		});
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
						<span className="truncate text-xs">{activeCollection.slug}</span>
					</div>
					<div>
						<ChevronsUpDown className="ml-auto size-4" />
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) rounded-lg" align="start" side="bottom" sideOffset={6}>
				<DropdownMenuLabel className="text-muted-foreground text-xs">Collections</DropdownMenuLabel>
				{collections.map((collection) => (
					<DropdownMenuItem key={collection.slug} className="gap-2 p-2" onClick={() => setActiveCollection(collection)}>
						{collection.name}
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem className="gap-2 p-2 flex items-center" onClick={addCollection} disabled={isPending}>
					<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
						<Plus className="size-4" />
					</div>
					<div className="text-muted-foreground font-medium">{isPending ? 'Adding…' : 'Create collection'}</div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
