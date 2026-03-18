'use server';

import db from '@/db/client';
import { itemsTable } from '@/db/schema';

import { Item } from '@/domain/item';

import { eq } from 'drizzle-orm';

export async function getItemById(id: Item['id']): Promise<Item>
{
	const [item] = await db.select().from(itemsTable).where(eq(itemsTable.id, id));
	return item;
}
