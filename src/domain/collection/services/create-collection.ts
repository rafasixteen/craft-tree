'use server';

import { collectionsTable } from '@/db/schema';
import { Collection, ensureUniqueSlug } from '@/domain/collection';
import { deslugify } from '@/lib/utils';
import db from '@/db/client';

interface CreateCollectionArgs
{
	name: string;
	userId: string;
}

export async function createCollection({ name, userId }: CreateCollectionArgs): Promise<Collection>
{
	const slug = await ensureUniqueSlug(name);
	const deslugifiedName = deslugify(slug);

	const [insertedCollection] = await db.insert(collectionsTable).values({ name: deslugifiedName, slug, userId }).returning();

	return insertedCollection;
}
