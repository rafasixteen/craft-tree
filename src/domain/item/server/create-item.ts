'use server';

import db from '@/db/client';
import { itemsTable } from '@/db/schema';

import { Item } from '@/domain/item';

type CreateItemParams = Omit<Item, 'id'>;

export async function createItem({ name, inventoryId }: CreateItemParams): Promise<Item>
{
	const [item] = await db.insert(itemsTable).values({ name, inventoryId }).returning();
	return item;
}
