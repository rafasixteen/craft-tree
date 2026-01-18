'use server';

import { collectionsTable } from '@/db/schema';
import { slugify } from '@/lib/utils';
import { Collection } from '@/domain/collection';
import db from '@/db/client';

interface CreateCollectionArgs
{
	name: string;
	userId: string;
}

export async function createCollection({ name, userId }: CreateCollectionArgs): Promise<Collection>
{
	const baseSlug = slugify(name);
	let suffix = 0;

	while (true)
	{
		const slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix}`;

		try
		{
			const [insertedCollection] = await db.insert(collectionsTable).values({ name, slug, userId }).returning();
			return insertedCollection;
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
