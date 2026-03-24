'use server';

import db from '@/db/client';
import { itemsTable } from '@/db/schema';

import { Inventory } from '@/domain/inventory';
import { Item } from '@/domain/item';

import { eq } from 'drizzle-orm';

interface GetItemsParams
{
	inventoryId: Inventory['id'];
}

export async function getItems({ inventoryId }: GetItemsParams): Promise<Item[]>
{
	return await db.select().from(itemsTable).where(eq(itemsTable.inventoryId, inventoryId));
}
