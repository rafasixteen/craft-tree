'use server';

import { inventories } from '@/db/schema';
import { Inventory } from '@/domain/inventory';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

interface DeleteInventoryParams
{
	inventoryId: Inventory['id'];
}

export async function deleteInventory({ inventoryId }: DeleteInventoryParams): Promise<void>
{
	await db.delete(inventories).where(eq(inventories.id, inventoryId));
}
