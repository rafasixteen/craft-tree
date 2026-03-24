'use server';

import db from '@/db/client';
import { producersTable } from '@/db/schema';

import { Inventory } from '@/domain/inventory';
import { Producer } from '@/domain/producer';

import { eq } from 'drizzle-orm';

interface GetProducersParams
{
	inventoryId: Inventory['id'];
}

export async function getProducers({ inventoryId }: GetProducersParams): Promise<Producer[]>
{
	return await db.select().from(producersTable).where(eq(producersTable.inventoryId, inventoryId));
}
