'use server';

import ItemCard from './ItemCard';
import { Item } from '@lib/types/item';

export default async function ItemsList({ items }: { items: Item[] })
{
	return (
		<div className="grid grid-cols-6 gap-4">
			{items.map((item) => (
				<ItemCard key={item.id} item={item} />
			))}
		</div>
	);
}
