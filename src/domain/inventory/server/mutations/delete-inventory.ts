'use server';

import db from '@/db/client';
import { inventoriesTable } from '@/db/schema';

import { Inventory } from '@/domain/inventory';

import { eq } from 'drizzle-orm';

interface DeleteInventoryParams
{
	inventoryId: Inventory['id'];
}

export async function deleteInventory({ inventoryId }: DeleteInventoryParams): Promise<void>
{
	await db.delete(inventoriesTable).where(eq(inventoriesTable.id, inventoryId));
}
