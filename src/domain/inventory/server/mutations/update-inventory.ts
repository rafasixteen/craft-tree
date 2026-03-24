'use server';

import db from '@/db/client';
import { inventoriesTable } from '@/db/schema';

import { Inventory } from '@/domain/inventory';

import { eq } from 'drizzle-orm';

type UpdateInventoryParams = Pick<Inventory, 'id' | 'name'>;

export async function updateInventory({ id, name }: UpdateInventoryParams): Promise<Inventory>
{
	const [inventory] = await db.update(inventoriesTable).set({ name }).where(eq(inventoriesTable.id, id)).returning();
	return inventory;
}
