'use server';

import db from '@/db/client';
import { itemsTable } from '@/db/schema';

import { Item } from '@/domain/item';

import { eq } from 'drizzle-orm';

interface DeleteItemParams
{
	itemId: Item['id'];
}

export async function deleteItem({ itemId }: DeleteItemParams): Promise<void>
{
	await db.delete(itemsTable).where(eq(itemsTable.id, itemId));
}
