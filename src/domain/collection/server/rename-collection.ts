'use server';

import { collectionsTable } from '@/db/schema';
import { Collection } from '@/domain/collection';
import { slugify } from '@/lib/utils';
import { nameSchema, withUniqueSlugRetry } from '@/domain/shared';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

interface RenameCollectionArgs
{
	collectionId: string;
	newName: string;
}

export async function renameCollection({ collectionId, newName }: RenameCollectionArgs): Promise<Collection>
{
	const parsedName = await nameSchema.parseAsync(newName);
	const baseSlug = slugify(parsedName);

	return withUniqueSlugRetry(baseSlug, async (slug) =>
	{
		const [updated] = await db.update(collectionsTable).set({ name: parsedName, slug }).where(eq(collectionsTable.id, collectionId)).returning();
		return updated;
	});
}
