'use server';

import { collectionsTable } from '@/db/schema';
import { Collection } from '@/domain/collection';
import db from '@/db/client';
import { eq } from 'drizzle-orm';

export async function getCollectionBySlug(slug: string): Promise<Collection | null>
{
	const existingCollection = await db
		.select()
		.from(collectionsTable)
		.where(eq(collectionsTable.slug, slug))
		.limit(1)
		.then((rows) => rows[0] || null);

	return existingCollection;
}
