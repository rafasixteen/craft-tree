'use server';

import { collectionsTable } from '@/db/schema';
import { slugify } from '@/lib/utils';
import { Collection } from '@/domain/collection';
import { nameSchema, withUniqueSlugRetry } from '@/domain/shared';
import db from '@/db/client';

interface CreateCollectionArgs
{
	name: string;
	userId: string;
}

export async function createCollection({ name, userId }: CreateCollectionArgs): Promise<Collection>
{
	const parsedName = await nameSchema.parseAsync(name);
	const baseSlug = slugify(parsedName);

	return withUniqueSlugRetry(baseSlug, async (slug) =>
	{
		const [inserted] = await db.insert(collectionsTable).values({ name: parsedName, slug, userId }).returning();
		return inserted;
	});
}
