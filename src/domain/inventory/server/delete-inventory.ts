'use server';

import { inventories } from '@/db/schema';
import { Inventory } from '@/domain/inventory';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function deleteInventory(id: Inventory['id']): Promise<void>
{
	await db.delete(inventories).where(eq(inventories.id, id));
}
