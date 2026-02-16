'use server';

import { itemTags } from '@/db/schema';
import { Item, ItemTag } from '@/domain/item';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export interface GetItemTagsParams
{
	itemId: Item['id'];
}

export async function getItemTags({ itemId }: GetItemTagsParams): Promise<ItemTag[]>
{
	return db.select().from(itemTags).where(eq(itemTags.itemId, itemId));
}
