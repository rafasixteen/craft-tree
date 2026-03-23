'use server';

import { Item } from '@/domain/item';
import db from '@/db/client';
import { producerOutputsTable } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

interface GetItemOutputUsageParams
{
	itemId: Item['id'];
}

export async function getItemOutputUsage({ itemId }: GetItemOutputUsageParams): Promise<number>
{
	const result = await db
		.select({ count: count() })
		.from(producerOutputsTable)
		.where(eq(producerOutputsTable.itemId, itemId));

	return result[0].count;
}
