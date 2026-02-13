'use server';

import { inventories } from '@/db/schema';
import { Inventory } from '@/domain/inventory';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

interface UpdateInventoryParams
{
	inventoryId: Inventory['id'];
	newName: string;
}

export async function updateInventory({ inventoryId, newName }: UpdateInventoryParams): Promise<Inventory>
{
	const [inventory] = await db.update(inventories).set({ name: newName }).where(eq(inventories.id, inventoryId)).returning();
	return inventory;
}
