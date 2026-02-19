'use server';

import { itemTags } from '@/db/schema';
import { Item, ItemTag } from '@/domain/item';
import { Tag } from '@/domain/tag';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

interface SetItemTagsParams
{
	itemId: Item['id'];
	tagIds: Tag['id'][];
}

export async function setItemTags({ itemId, tagIds }: SetItemTagsParams): Promise<ItemTag[]>
{
	return db.transaction(async (tx) =>
	{
		await tx.delete(itemTags).where(eq(itemTags.itemId, itemId));

		if (tagIds.length === 0)
		{
			return [];
		}

		return await tx
			.insert(itemTags)
			.values(
				tagIds.map((tagId) => ({
					itemId,
					tagId,
				})),
			)
			.returning();
	});
}
