'use server';

import { items } from '@/db/schema';
import { Item } from '@/domain/item';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

interface DeleteItemParams
{
	itemId: Item['id'];
}

export async function deleteItem({ itemId }: DeleteItemParams): Promise<void>
{
	await db.delete(items).where(eq(items.id, itemId));
}
