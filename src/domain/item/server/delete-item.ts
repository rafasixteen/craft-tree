'use server';

import { items } from '@/db/schema';
import { Item } from '@/domain/item';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function deleteItem(id: Item['id']): Promise<void>
{
	await db.delete(items).where(eq(items.id, id));
}
