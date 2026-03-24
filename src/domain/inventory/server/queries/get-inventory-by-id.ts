'use server';

import db from '@/db/client';
import { inventoriesTable } from '@/db/schema';

import { Inventory } from '@/domain/inventory';

import { eq } from 'drizzle-orm';

interface GetInventoryByIdParams
{
	inventoryId: Inventory['id'];
}

export async function getInventoryById({ inventoryId }: GetInventoryByIdParams): Promise<Inventory>
{
	const [inventory] = await db.select().from(inventoriesTable).where(eq(inventoriesTable.id, inventoryId));
	return inventory;
}
