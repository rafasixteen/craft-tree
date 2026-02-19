'use client';

import { Header } from '@/components/craft-tree-sidebar';
import { useActiveInventory } from '@/components/inventory';
import { Card } from '@/components/ui/card';
import { useTags } from '@/domain/tag';

export default function InventoryTagsPage()
{
	const inventory = useActiveInventory();
	const { tags } = useTags(inventory.id);

	return (
		<>
			<Header></Header>
			<div className="flex flex-col gap-2 p-5">
				{tags.map((tag) =>
				{
					return <Card key={tag.id}>{tag.name}</Card>;
				})}
			</div>
		</>
	);
}
