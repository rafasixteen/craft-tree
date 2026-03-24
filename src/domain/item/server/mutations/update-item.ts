'use server';

import db from '@/db/client';
import { itemsTable } from '@/db/schema';

import { Item } from '@/domain/item';

import { eq } from 'drizzle-orm';

type UpdateItemParams = Pick<Item, 'id' | 'name'>;

export async function updateItem({ id, name }: UpdateItemParams): Promise<Item>
{
	const [item] = await db.update(itemsTable).set({ name }).where(eq(itemsTable.id, id)).returning();
	return item;
}
