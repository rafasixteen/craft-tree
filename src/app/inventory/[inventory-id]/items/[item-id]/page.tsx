'use client';

import { Header } from '@/components/craft-tree-sidebar';
import { useItemTags, useItem } from '@/domain/item';
import { useTags } from '@/domain/tag';
import { useParams } from 'next/navigation';

export default function ItemPage()
{
	const params = useParams();
	const itemId = params['item-id'] as string;

	const { item } = useItem(itemId);

	const { tags: itemTags } = useItemTags(itemId);
	const { tags: inventoryTags } = useTags({ inventoryId: item.inventoryId });

	const tags = itemTags.map((tag) => inventoryTags.find((t) => t.id === tag.tagId));

	return (
		<>
			<Header />
			<div className="mx-auto max-w-3xl px-6 py-8">
				<section className="mb-8">
					<h2 className="mb-2 text-xl font-semibold">Item</h2>
					<pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm text-muted-foreground">{JSON.stringify(item, null, 2)}</pre>
				</section>

				<section className="mb-8">
					<h2 className="mb-2 text-xl font-semibold">Item Tags</h2>
					<pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm text-muted-foreground">{JSON.stringify(tags, null, 2)}</pre>
				</section>
			</div>
		</>
	);
}
