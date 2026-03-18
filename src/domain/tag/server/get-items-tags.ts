'use server';

import { eq } from 'drizzle-orm';
import { itemTags, tags } from '@/db/schema';
import { ItemTag } from '@/domain/item';
import { Inventory } from '@/domain/inventory';
import db from '@/db/client';

interface GetItemsTagsParams
{
	inventoryId: Inventory['id'];
}

export async function getItemsTags({
	inventoryId,
}: GetItemsTagsParams): Promise<ItemTag[]>
{
	return await db
		.select({
			itemId: itemTags.itemId,
			tagId: itemTags.tagId,
		})
		.from(itemTags)
		.innerJoin(tags, eq(itemTags.tagId, tags.id))
		.where(eq(tags.inventoryId, inventoryId));
}
