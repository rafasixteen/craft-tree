'use server';

import { itemsTable } from '@/db/schema';
import { slugify } from '@/lib/utils';
import { Item } from '@/domain/item';
import { withUniqueSlugRetry, nameSchema } from '@/domain/shared';
import { and, eq, isNull, sql } from 'drizzle-orm';
import db from '@/db/client';

interface CreateItemArgs
{
	name: string;
	collectionId: string;
	folderId: string | null;
}

export async function createItem({ name, collectionId, folderId }: CreateItemArgs): Promise<Item>
{
	const [parsedName, order] = await Promise.all([nameSchema.parseAsync(name), getNextItemOrder(collectionId, folderId)]);

	const baseSlug = slugify(parsedName);

	return withUniqueSlugRetry(baseSlug, async (slug) =>
	{
		const [insertedItem] = await db.insert(itemsTable).values({ name, slug, collectionId, folderId, order }).returning();
		return insertedItem;
	});
}

async function getNextItemOrder(collectionId: string, folderId: string | null)
{
	const [row] = await db
		.select({ max: sql<number>`coalesce(max(${itemsTable.order}), 0)` })
		.from(itemsTable)
		.where(
			folderId === null
				? and(eq(itemsTable.collectionId, collectionId), isNull(itemsTable.folderId))
				: and(eq(itemsTable.collectionId, collectionId), eq(itemsTable.folderId, folderId)),
		);

	return row.max + 1;
}
