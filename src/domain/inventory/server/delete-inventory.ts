'use server';

import db from '@/db/client';
import { inventoriesTable } from '@/db/schema';

import { Inventory } from '@/domain/inventory';

import { eq } from 'drizzle-orm';

export async function deleteInventory(id: Inventory['id']): Promise<void>
{
	await db.delete(inventoriesTable).where(eq(inventoriesTable.id, id));
}
