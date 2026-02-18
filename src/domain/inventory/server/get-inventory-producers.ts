'use server';

import { producers } from '@/db/schema';
import { Inventory } from '@/domain/inventory';
import { Producer } from '@/domain/producer';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function getInventoryProducers(inventoryId: Inventory['id']): Promise<Producer[]>
{
	return await db.select().from(producers).where(eq(producers.inventoryId, inventoryId));
}
