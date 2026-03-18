'use server';

import db from '@/db/client';
import { inventoriesTable } from '@/db/schema';

import { Inventory } from '@/domain/inventory';

import { eq } from 'drizzle-orm';
import { User } from '@supabase/supabase-js';

export async function getInventoriesByUserId(id: User['id']): Promise<Inventory[]>
{
	return await db.select().from(inventoriesTable).where(eq(inventoriesTable.userId, id));
}
