'use server';

import { Item } from '@/lib/types/item';

export default async function ItemCard({ item }: { item: Item })
{
	return (
		<div className="border rounded p-2 flex flex-col items-center">
			<span>{item.name}</span>
		</div>
	);
}
