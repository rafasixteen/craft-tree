'use server';

import db from '@/db/client';
import { itemsTable } from '@/db/schema';

import { Item } from '@/domain/item';

import { eq } from 'drizzle-orm';

interface GetItemByIdParams
{
	itemId: Item['id'];
}

export async function getItemById({ itemId }: GetItemByIdParams): Promise<Item>
{
	const [item] = await db.select().from(itemsTable).where(eq(itemsTable.id, itemId));
	return item;
}
