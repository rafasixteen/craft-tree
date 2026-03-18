'use server';

import db from '@/db/client';
import { items } from '@/db/schema';

import { Item } from '@/domain/item';

import { eq } from 'drizzle-orm';

type UpdateItemParams = Pick<Item, 'id' | 'name'>;

export async function updateItem({ id, name }: UpdateItemParams): Promise<Item>
{
	const [item] = await db.update(items).set({ name }).where(eq(items.id, id)).returning();
	return item;
}
