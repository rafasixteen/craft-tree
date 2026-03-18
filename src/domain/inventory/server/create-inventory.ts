'use server';

import db from '@/db/client';
import { inventories } from '@/db/schema';

import { Inventory } from '@/domain/inventory';

type CreateInventoryParams = Omit<Inventory, 'id'>;

export async function createInventory({ name, userId }: CreateInventoryParams): Promise<Inventory>
{
	const [inventory] = await db.insert(inventories).values({ name, userId }).returning();
	return inventory;
}
