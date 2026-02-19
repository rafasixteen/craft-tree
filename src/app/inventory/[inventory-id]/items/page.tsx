'use client';

import { Header } from '@/components/craft-tree-sidebar';
import { ItemGrid } from '@/components/item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useItemFilters } from '@/domain/item';
import { useEffect, useState } from 'react';
import { TagsCombobox } from '@/components/tag/tags-combo-box';
import { useActiveInventory } from '@/components/inventory';
import { useTags } from '@/domain/tag';
import Link from 'next/link';

export default function ItemsPage()
{
	const { searchTerm, tags, setSearchTerm, setTags } = useItemFilters();

	const [localSearch, setLocalSearch] = useState<string>(searchTerm ?? '');

	const inventory = useActiveInventory();
	const { tags: inventoryTags } = useTags(inventory.id);

	useEffect(() =>
	{
		const handler = setTimeout(() =>
		{
			setSearchTerm(localSearch.trim() === '' ? null : localSearch);
		}, 250);

		return () => clearTimeout(handler);
	}, [localSearch, setSearchTerm]);

	function onSearchBarChange(e: React.ChangeEvent<HTMLInputElement>)
	{
		setLocalSearch(e.target.value);
	}

	function onTagsComboBoxChange(tagIds: string[] | null)
	{
		if (tagIds === null)
		{
			setTags(null);
			return;
		}

		const tags = tagIds.map((id) => inventoryTags.find((t) => t.id === id)!).filter(Boolean);
		const tagNames = tags.map((t) => t.name);

		setTags(tagNames);
	}

	const tagIds = tags?.map((name) => inventoryTags.find((t) => t.name === name)?.id).filter((id): id is string => Boolean(id)) ?? [];

	return (
		<>
			<Header>
				<Button asChild variant="default">
					<Link href="items/add">Add Item</Link>
				</Button>
				<Input type="text" placeholder="Search items..." value={localSearch} onChange={onSearchBarChange} />
				<TagsCombobox value={tagIds} onIdsChange={onTagsComboBoxChange} className="w-full" />
			</Header>
			<div className="flex flex-1 flex-col gap-4 p-4">
				<ItemGrid />
			</div>
		</>
	);
}
