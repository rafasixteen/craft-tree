'use server';

import db from '@/db/client';
import { items } from '@/db/schema';

import { Item } from '@/domain/item';

import { eq } from 'drizzle-orm';

export async function deleteItem(id: Item['id']): Promise<void>
{
	await db.delete(items).where(eq(items.id, id));
}
