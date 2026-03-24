'use server';

import db from '@/db/client';
import { tagsTable } from '@/db/schema';

import { Inventory } from '@/domain/inventory';
import { Tag } from '@/domain/tag';

import { asc, eq } from 'drizzle-orm';

export interface GetTagsParams
{
	inventoryId: Inventory['id'];
}

export async function getTags({ inventoryId }: GetTagsParams): Promise<Tag[]>
{
	return await db.select().from(tagsTable).where(eq(tagsTable.inventoryId, inventoryId)).orderBy(asc(tagsTable.name));
}
