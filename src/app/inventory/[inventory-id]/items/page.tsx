'use client';

import { Header } from '@/components/craft-tree-sidebar';
import { ItemGrid } from '@/components/item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Item, useItems, ItemQueryOptions } from '@/domain/item';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { TagsCombobox } from '@/components/tag/tags-combo-box';
import { useActiveInventory } from '@/components/inventory';
import { Tag, useTags } from '@/domain/tag';
import { GridProvider } from '@/components/grid';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// TODO: Can we simplify the state management here? It's a bit
// complex with the local vs debounced state and syncing with URL params.

export default function ItemsPage()
{
	const router = useRouter();
	const searchParams = useSearchParams();

	const inventory = useActiveInventory();
	const { tags: inventoryTags } = useTags({ inventoryId: inventory.id });

	const rawSearch = searchParams.get('search') ?? '';
	const rawTags = searchParams.get('tags') ?? '';

	const tagByIdMap: Map<Tag['id'], Tag> = new Map(inventoryTags.map((t) => [t.id, t]));
	const tagByNameMap: Map<Tag['name'], Tag> = new Map(inventoryTags.map((t) => [t.name, t]));

	const [localSearch, setLocalSearch] = useState<string>(rawSearch);
	const [localTagIds, setLocalTagIds] = useState<string[]>(
		rawTags
			.split(',')
			.map((name) => tagByNameMap.get(name)?.id)
			.filter(Boolean) as string[],
	);

	const [debouncedSearch, setDebouncedSearch] = useState(localSearch);
	const [debouncedTagIds, setDebouncedTagIds] = useState(localTagIds);

	useEffect(() =>
	{
		const handler = setTimeout(() =>
		{
			setDebouncedSearch(localSearch);
			setDebouncedTagIds(localTagIds);

			const params = new URLSearchParams(window.location.search);

			if (!localSearch.trim()) params.delete('search');
			else params.set('search', localSearch.trim());

			if (!localTagIds || localTagIds.length === 0) params.delete('tags');
			else
			{
				const tagNames = localTagIds.map((id) => tagByIdMap.get(id)?.name).filter(Boolean) as string[];
				if (tagNames.length > 0) params.set('tags', tagNames.join(','));
				else params.delete('tags');
			}

			router.push(`?${params.toString()}`, { scroll: false });
		}, 300);

		return () => clearTimeout(handler);
	}, [localSearch, localTagIds, router, tagByIdMap]);

	const queryOptions: ItemQueryOptions = useMemo(
		() => ({
			filters: {
				search: debouncedSearch.trim() || undefined,
				tagIds: debouncedTagIds.length > 0 ? debouncedTagIds : undefined,
			},
		}),
		[debouncedSearch, debouncedTagIds],
	);

	const { items } = useItems({ inventoryId: inventory.id, options: queryOptions });

	const onSearchBarChange = useCallback(
		function onSearchBarChange(e: React.ChangeEvent<HTMLInputElement>)
		{
			setLocalSearch(e.target.value);
		},
		[setLocalSearch],
	);

	const onTagsComboBoxChange = useCallback(
		function onTagsComboBoxChange(tagIds: string[])
		{
			setLocalTagIds(tagIds);
		},
		[setLocalTagIds],
	);

	const getItemHref = useCallback(
		function getItemHref(id: string)
		{
			return `/inventory/${inventory.id}/items/${id}`;
		},
		[inventory.id],
	);

	return (
		<GridProvider<Item> cells={items} getCellHref={getItemHref}>
			<Header>
				<div className="flex items-center gap-2">
					<Button asChild variant="default" size="sm">
						<Link href="items/add">Add Item</Link>
					</Button>

					<Input type="text" placeholder="Search items..." value={localSearch} onChange={onSearchBarChange} className="w-48 md:w-64" />
				</div>
				<TagsCombobox value={localTagIds} onIdsChange={onTagsComboBoxChange} className="w-48 md:w-64" maxChips={2} />
			</Header>

			<div className="flex flex-1 flex-col gap-4 p-4">
				<ItemGrid />
			</div>
		</GridProvider>
	);
}
