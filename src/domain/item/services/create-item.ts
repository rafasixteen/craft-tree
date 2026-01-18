'use server';

import { itemsTable } from '@/db/schema';
import { slugify } from '@/lib/utils';
import { Item } from '@/domain/item';
import { withUniqueSlugRetry, nameSchema } from '@/domain/shared';
import db from '@/db/client';

interface CreateItemArgs
{
	name: string;
	folderId: string | null;
}

export async function createItem({ name, folderId }: CreateItemArgs): Promise<Item>
{
	const parsedName = await nameSchema.parseAsync(name);
	const baseSlug = slugify(parsedName);

	return withUniqueSlugRetry(baseSlug, async (slug) =>
	{
		const [insertedItem] = await db.insert(itemsTable).values({ name, slug, folderId }).returning();
		return insertedItem;
	});
}
