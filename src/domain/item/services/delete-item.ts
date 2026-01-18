'use server';

import { itemsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function deleteItem(itemId: string)
{
	await db.delete(itemsTable).where(eq(itemsTable.id, itemId));
}
