'use server';

import { Item } from '@prisma/client';

export default async function ItemsList({ items }: { items: Item[] })
{
	return (
		<ul>
			{items.map((item) => (
				<li key={item.id}>{item.name}</li>
			))}
		</ul>
	);
}
