'use server';

import { getDescendantNodes } from '@/lib/graphql/nodes';
import { Collection } from '@components/Collection';

export default async function ItemTreeLoader(collection: Collection)
{
	return getDescendantNodes(collection.id, {
		id: true,
		name: true,
		type: true,
		order: true,
		children: { id: true },
		item: { id: true, name: true },
		recipe: { id: true },
	});
}
