'use server';

import db from '@/db/client';
import { itemTagsTable } from '@/db/schema';

import { Item, ItemTag } from '@/domain/item';

import { eq } from 'drizzle-orm';

interface GetItemTagsParams
{
	itemId: Item['id'];
}

export async function getItemTags({ itemId }: GetItemTagsParams): Promise<ItemTag[]>
{
	return db.select().from(itemTagsTable).where(eq(itemTagsTable.itemId, itemId));
}
