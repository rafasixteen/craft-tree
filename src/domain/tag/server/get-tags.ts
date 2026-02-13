'use server';

import { tags } from '@/db/schema';
import { Tag } from '@/domain/tag';
import { Inventory } from '@/domain/inventory';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export interface GetTagsParams
{
	inventoryId: Inventory['id'];
}

export async function getTags({ inventoryId }: GetTagsParams): Promise<Tag[]>
{
	const tagsList = await db.select().from(tags).where(eq(tags.inventoryId, inventoryId));
	return tagsList;
}
