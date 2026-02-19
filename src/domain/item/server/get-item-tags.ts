'use server';

import { itemTags } from '@/db/schema';
import { Item, ItemTag } from '@/domain/item';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function getItemTags(id: Item['id']): Promise<ItemTag[]>
{
	return db.select().from(itemTags).where(eq(itemTags.itemId, id));
}
