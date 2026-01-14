'use server';

import { itemsTable } from '@/db/schema';
import { slugify } from '@/lib/utils';
import { Item } from '@/domain/item';
import db from '@/db/client';

interface CreateItemArgs
{
	name: string;
	collectionId: string;
}

export async function createItem({ name, collectionId }: CreateItemArgs): Promise<Item>
{
	const baseSlug = slugify(name);
	let suffix = 0;

	while (true)
	{
		const slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix}`;

		try
		{
			const [insertedItem] = await db.insert(itemsTable).values({ name, slug, collectionId }).returning();
			return insertedItem;
		}
		catch (error: any)
		{
			if (error.cause.code === '23505')
			{
				// Unique constraint violation—retry with next suffix
				suffix++;
				continue;
			}

			throw error;
		}
	}
}
