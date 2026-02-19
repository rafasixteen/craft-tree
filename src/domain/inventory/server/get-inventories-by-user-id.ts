'use server';

import { inventories } from '@/db/schema';
import { Inventory } from '@/domain/inventory';
import { eq } from 'drizzle-orm';
import { User } from '@/domain/user';
import db from '@/db/client';

export async function getInventoriesByUserId(id: User['id']): Promise<Inventory[]>
{
	return await db.select().from(inventories).where(eq(inventories.userId, id));
}
