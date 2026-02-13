'use server';

import { inventories } from '@/db/schema';
import { Inventory } from '@/domain/inventory';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function getInventories(userId: string): Promise<Inventory[]>
{
	return await db.select().from(inventories).where(eq(inventories.userId, userId));
}
