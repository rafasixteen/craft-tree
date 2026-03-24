'use server';

import { Item } from '@/domain/item';
import db from '@/db/client';
import { producerOutputsTable } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

interface GetItemProducerOutputUsageParams
{
	itemId: Item['id'];
}

// TODO: Should this live in the producer domain instead?

export async function getItemProducerOutputUsage({ itemId }: GetItemProducerOutputUsageParams): Promise<number>
{
	const result = await db
		.select({ count: count() })
		.from(producerOutputsTable)
		.where(eq(producerOutputsTable.itemId, itemId));

	return result[0].count;
}
