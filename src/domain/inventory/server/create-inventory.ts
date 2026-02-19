'use server';

import { inventories } from '@/db/schema';
import { Inventory } from '@/domain/inventory';
import db from '@/db/client';

type CreateInventoryParams = Omit<Inventory, 'id'>;

export async function createInventory({ name, userId }: CreateInventoryParams): Promise<Inventory>
{
	const [inventory] = await db.insert(inventories).values({ name, userId }).returning();
	return inventory;
}
