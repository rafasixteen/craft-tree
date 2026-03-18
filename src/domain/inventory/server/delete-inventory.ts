'use server';

import db from '@/db/client';
import { eq } from 'drizzle-orm';
import { inventories } from '@/db/schema';
import { Inventory } from '@/domain/inventory';

export async function deleteInventory(id: Inventory['id']): Promise<void>
{
	await db.delete(inventories).where(eq(inventories.id, id));
}
