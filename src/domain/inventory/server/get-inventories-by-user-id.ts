'use server';

import db from '@/db/client';
import { eq } from 'drizzle-orm';
import { inventories } from '@/db/schema';
import { User } from '@supabase/supabase-js';
import { Inventory } from '@/domain/inventory';

export async function getInventoriesByUserId(
	id: User['id'],
): Promise<Inventory[]>
{
	return await db
		.select()
		.from(inventories)
		.where(eq(inventories.userId, id));
}
