'use server';

import db from '@/db/client';
import { itemTagsTable } from '@/db/schema';

import { Tag } from '@/domain/tag';
import { Item, ItemTag } from '@/domain/item';

import { eq } from 'drizzle-orm';

interface SetItemTagsParams
{
	itemId: Item['id'];
	tagIds: Tag['id'][];
}

export async function setItemTags({ itemId, tagIds }: SetItemTagsParams): Promise<ItemTag[]>
{
	return db.transaction(async (tx) =>
	{
		await tx.delete(itemTagsTable).where(eq(itemTagsTable.itemId, itemId));

		if (tagIds.length === 0)
		{
			return [];
		}

		return await tx
			.insert(itemTagsTable)
			.values(
				tagIds.map((tagId) => ({
					itemId,
					tagId,
				})),
			)
			.returning();
	});
}
