'use server';

import db from '@/db/client';
import { itemTagsTable } from '@/db/schema';

import { Item, ItemTag } from '@/domain/item';

import { eq } from 'drizzle-orm';

export async function getItemTags(id: Item['id']): Promise<ItemTag[]>
{
	return db.select().from(itemTagsTable).where(eq(itemTagsTable.itemId, id));
}
