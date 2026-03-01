'use server';

import { items } from '@/db/schema';
import { Item } from '@/domain/item';
import db from '@/db/client';

type CreateItemParams = Omit<Item, 'id'>;

export async function createItem({ name, inventoryId }: CreateItemParams): Promise<Item>
{
	const [item] = await db.insert(items).values({ name, inventoryId }).returning();
	return item;
}
