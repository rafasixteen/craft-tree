'use server';

import { items } from '@/db/schema';
import { Item } from '@/domain/item';
import db from '@/db/client';
import { Inventory } from '@/domain/inventory';

interface CreateItemParams
{
	name: Item['name'];
	inventoryId: Inventory['id'];
	icon?: Item['icon'];
}

export async function createItem({ name, inventoryId, icon }: CreateItemParams): Promise<Item>
{
	const [item] = await db.insert(items).values({ name, icon, inventoryId }).returning();
	return item;
}
