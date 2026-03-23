'use server';

import { Item } from '@/domain/item';
import db from '@/db/client';
import { producerInputsTable } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

interface GetItemInputUsageParams
{
	itemId: Item['id'];
}

export async function getItemInputUsage({ itemId }: GetItemInputUsageParams): Promise<number>
{
	const result = await db
		.select({ count: count() })
		.from(producerInputsTable)
		.where(eq(producerInputsTable.itemId, itemId));

	return result[0].count;
}
