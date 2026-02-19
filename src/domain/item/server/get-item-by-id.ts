'use server';

import { items } from '@/db/schema';
import { Item } from '@/domain/item';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function getItemById(id: Item['id']): Promise<Item>
{
	const [item] = await db.select().from(items).where(eq(items.id, id));
	return item;
}
