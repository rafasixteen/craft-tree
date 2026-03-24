'use server';

import { Item } from '@/domain/item';
import db from '@/db/client';
import { producerInputsTable } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

interface GetItemProducerInputUsageParams
{
	itemId: Item['id'];
}

// TODO: Should this live in the producer domain instead?

export async function getItemProducerInputUsage({ itemId }: GetItemProducerInputUsageParams): Promise<number>
{
	const result = await db
		.select({ count: count() })
		.from(producerInputsTable)
		.where(eq(producerInputsTable.itemId, itemId));

	return result[0].count;
}
