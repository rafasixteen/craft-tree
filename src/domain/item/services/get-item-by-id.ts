'use server';

import { itemsTable } from '@/db/schema';
import { Item } from '@/domain/item';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function getItemById(id: string): Promise<Item | null>
{
	const existingItem = await db
		.select()
		.from(itemsTable)
		.where(eq(itemsTable.id, id))
		.limit(1)
		.then((rows) => rows[0] || null);

	return existingItem;
}
