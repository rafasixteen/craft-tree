'use client';

import { Header } from '@/components/craft-tree-sidebar';
import { ItemGrid } from '@/components/item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Item, useItems, useItemFilters, ItemQueryOptions } from '@/domain/item';
import { useCallback, useEffect, useState } from 'react';
import { TagsCombobox } from '@/components/tag/tags-combo-box';
import { useActiveInventory } from '@/components/inventory';
import { useTags } from '@/domain/tag';
import { GridProvider } from '@/components/grid';
import Link from 'next/link';

export default function ItemsPage()
{
	const { searchTerm, tags, setSearchTerm, setTags } = useItemFilters();

	const [localSearch, setLocalSearch] = useState<string>(searchTerm ?? '');

	const inventory = useActiveInventory();
	const { tags: inventoryTags } = useTags(inventory.id);

	const tagIds = tags?.map((name) => inventoryTags.find((tag) => tag.name === name)?.id).filter((id): id is string => Boolean(id)) ?? [];

	const queryOptions: ItemQueryOptions = {
		filters: {
			search: searchTerm ?? undefined,
			tagIds: tagIds.length > 0 ? tagIds : undefined,
		},
	};

	const { items } = useItems({ inventoryId: inventory.id, options: queryOptions });

	const onSearchBarChange = useCallback(function onSearchBarChange(e: React.ChangeEvent<HTMLInputElement>)
	{
		setLocalSearch(e.target.value);
	}, []);

	const onTagsComboBoxChange = useCallback(
		function onTagsComboBoxChange(tagIds: string[] | null)
		{
			if (tagIds === null)
			{
				setTags(null);
				return;
			}
			else
			{
				const tags = tagIds.map((id) => inventoryTags.find((t) => t.id === id)!).filter(Boolean);
				setTags(tags.map((t) => t.name));
			}
		},
		[inventoryTags, setTags],
	);

	const getItemHref = useCallback(
		function getItemHref(id: string)
		{
			return `/inventory/${inventory.id}/items/${id}`;
		},
		[inventory.id],
	);

	useEffect(() =>
	{
		const handler = setTimeout(() =>
		{
			setSearchTerm(localSearch.trim() === '' ? null : localSearch);
		}, 250);

		return () => clearTimeout(handler);
	}, [localSearch, setSearchTerm]);

	return (
		<GridProvider<Item> cells={items} getCellHref={getItemHref}>
			<Header>
				<Button asChild variant="default">
					<Link href="items/add">Add Item</Link>
				</Button>
				<Input type="text" placeholder="Search items..." value={localSearch} onChange={onSearchBarChange} />
				<TagsCombobox value={tagIds} onIdsChange={onTagsComboBoxChange} className="w-full" maxChips={3} />
			</Header>
			<div className="flex flex-1 flex-col gap-4 p-4">
				<ItemGrid />
			</div>
		</GridProvider>
	);
}
