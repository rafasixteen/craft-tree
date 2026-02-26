'use client';

import { Header } from '@/components/craft-tree-sidebar';
import { TagGrid } from '@/components/tag';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag, useTags, TagQueryOptions } from '@/domain/tag';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useInventory } from '@/components/inventory';
import { GridProvider } from '@/components/grid';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// TODO: Can we simplify the state management here? It's a bit
// complex with the local vs debounced state and syncing with URL params.

export default function TagsPage()
{
	const router = useRouter();
	const searchParams = useSearchParams();

	const inventory = useInventory();
	const { tags: inventoryTags } = useTags({ inventoryId: inventory.id });

	const rawSearch = searchParams.get('search') ?? '';

	const tagByIdMap: Map<Tag['id'], Tag> = new Map(inventoryTags.map((t) => [t.id, t]));

	const [localSearch, setLocalSearch] = useState<string>(rawSearch);

	const [debouncedSearch, setDebouncedSearch] = useState(localSearch);

	useEffect(() =>
	{
		const handler = setTimeout(() =>
		{
			setDebouncedSearch(localSearch);

			const params = new URLSearchParams(window.location.search);

			if (!localSearch.trim()) params.delete('search');
			else params.set('search', localSearch.trim());

			router.push(`?${params.toString()}`, { scroll: false });
		}, 300);

		return () => clearTimeout(handler);
	}, [localSearch, router, tagByIdMap]);

	const queryOptions: TagQueryOptions = useMemo(
		() => ({
			filters: {
				search: debouncedSearch.trim() || undefined,
			},
		}),
		[debouncedSearch],
	);

	const { tags } = useTags({ inventoryId: inventory.id, options: queryOptions });

	const onSearchBarChange = useCallback(
		function onSearchBarChange(e: React.ChangeEvent<HTMLInputElement>)
		{
			setLocalSearch(e.target.value);
		},
		[setLocalSearch],
	);

	const getTagHref = useCallback(
		function getTagHref(id: string)
		{
			return `/inventories/${inventory.id}/tags/${id}`;
		},
		[inventory.id],
	);

	return (
		<GridProvider<Tag> cells={tags} getCellHref={getTagHref}>
			<Header>
				<div className="flex items-center gap-2">
					<Button asChild variant="default" size="sm">
						<Link href="tags/add">Add Tag</Link>
					</Button>

					<Input type="text" placeholder="Search tags..." value={localSearch} onChange={onSearchBarChange} className="w-48 md:w-64" />
				</div>
			</Header>

			<div className="flex flex-1 flex-col gap-4 p-4">
				<TagGrid />
			</div>
		</GridProvider>
	);
}
