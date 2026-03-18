'use server';

import { inventories } from '@/db/schema';
import { Inventory } from '@/domain/inventory';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

type UpdateInventoryParams = Pick<Inventory, 'id' | 'name'>;

export async function updateInventory({
	id,
	name,
}: UpdateInventoryParams): Promise<Inventory>
{
	const [inventory] = await db
		.update(inventories)
		.set({ name })
		.where(eq(inventories.id, id))
		.returning();
	return inventory;
}
