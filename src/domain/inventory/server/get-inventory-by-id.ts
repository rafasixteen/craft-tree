'use server';

import db from '@/db/client';
import { inventories } from '@/db/schema';

import { Inventory } from '@/domain/inventory';

import { eq } from 'drizzle-orm';

export async function getInventoryById(id: Inventory['id']): Promise<Inventory>
{
	const [inventory] = await db.select().from(inventories).where(eq(inventories.id, id));
	return inventory;
}
