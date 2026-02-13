'use server';

import { items } from '@/db/schema';
import { Item } from '@/domain/item';
import { Inventory } from '@/domain/inventory';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function getInventoryItems(inventoryId: Inventory['id']): Promise<Item[]>
{
	return await db.select().from(items).where(eq(items.inventoryId, inventoryId));
}
