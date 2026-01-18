'use server';

import { itemsTable } from '@/db/schema';
import { slugify } from '@/lib/utils';
import { Item } from '@/domain/item';
import { withUniqueSlugRetry, nameSchema } from '@/domain/shared';
import db from '@/db/client';

interface CreateItemArgs
{
	name: string;
	collectionId: string;
	folderId: string | null;
}

export async function createItem({ name, collectionId, folderId }: CreateItemArgs): Promise<Item>
{
	const parsedName = await nameSchema.parseAsync(name);
	const baseSlug = slugify(parsedName);

	return withUniqueSlugRetry(baseSlug, async (slug) =>
	{
		const [insertedItem] = await db.insert(itemsTable).values({ name, slug, collectionId, folderId }).returning();
		return insertedItem;
	});
}
