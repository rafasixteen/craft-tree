'use server';

import db from '@/db/client';
import { itemTagsTable, tags } from '@/db/schema';

import { ItemTag } from '@/domain/item';
import { Inventory } from '@/domain/inventory';

import { eq } from 'drizzle-orm';

interface GetItemsTagsParams
{
	inventoryId: Inventory['id'];
}

export async function getItemsTags({ inventoryId }: GetItemsTagsParams): Promise<ItemTag[]>
{
	return await db
		.select({
			itemId: itemTagsTable.itemId,
			tagId: itemTagsTable.tagId,
		})
		.from(itemTagsTable)
		.innerJoin(tags, eq(itemTagsTable.tagId, tags.id))
		.where(eq(tags.inventoryId, inventoryId));
}
