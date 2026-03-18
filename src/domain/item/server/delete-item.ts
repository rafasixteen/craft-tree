'use server';

import db from '@/db/client';
import { itemsTable } from '@/db/schema';

import { Item } from '@/domain/item';

import { eq } from 'drizzle-orm';

export async function deleteItem(id: Item['id']): Promise<void>
{
	await db.delete(itemsTable).where(eq(itemsTable.id, id));
}
