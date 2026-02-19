'use server';

import { items } from '@/db/schema';
import { Item } from '@/domain/item';
import db from '@/db/client';

type CreateItemParams = Omit<Item, 'id'>;

export async function createItem({ name, icon, inventoryId }: CreateItemParams): Promise<Item>
{
	const [item] = await db.insert(items).values({ name, icon, inventoryId }).returning();
	return item;
}
