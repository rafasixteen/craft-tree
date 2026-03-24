'use client';

import { Header } from '@/components/sidebar';

import { Button } from '@/components/ui/button';

import { useTags } from '@/domain/inventory';
import { useItem, useItemTags } from '@/domain/item';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ItemPage()
{
	// TODO: Add loading and validating states to the dialog, and disable the confirm button while loading/validating.

	const params = useParams();
	const itemId = params['item-id'] as string;

	const { item } = useItem({ itemId });

	const { tags: itemTags } = useItemTags({ itemId });
	const { tags: inventoryTags } = useTags({ inventoryId: item?.inventoryId });

	const tags = itemTags?.map((tag) => inventoryTags?.find((t) => t.id === tag.tagId));

	return (
		<>
			<Header />
			<div className="mx-auto max-w-3xl px-6 py-8">
				<Button className="mb-4" variant="outline" size="sm" asChild>
					<Link href={`/inventories/${item.inventoryId}/items/${itemId}/recipe-tree`}>Recipe Tree</Link>
				</Button>

				<section className="mb-8">
					<h2 className="mb-2 text-xl font-semibold">Item</h2>
					<pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm text-muted-foreground">
						{JSON.stringify(item, null, 2)}
					</pre>
				</section>

				<section className="mb-8">
					<h2 className="mb-2 text-xl font-semibold">Item Tags</h2>
					<pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm text-muted-foreground">
						{JSON.stringify(tags, null, 2)}
					</pre>
				</section>
			</div>
		</>
	);
}
