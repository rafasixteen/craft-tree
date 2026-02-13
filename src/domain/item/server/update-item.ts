'use server';

import { items } from '@/db/schema';
import { Item } from '@/domain/item';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export interface UpdateItemParams
{
	itemId: Item['id'];
	name?: Item['name'];
	icon?: Item['icon'];
}

export async function updateItem({ itemId, name, icon }: UpdateItemParams): Promise<Item>
{
	const [item] = await db.update(items).set({ name, icon }).where(eq(items.id, itemId)).returning();
	return item;
}
