'use server';

import db from '@/db/client';
import { producerOutputsTable, producersTable } from '@/db/schema';

import { Item } from '@/domain/item';
import { Producer } from '@/domain/producer';

import { asc, eq } from 'drizzle-orm';

interface GetProducersByOutputItemParams
{
	itemId: Item['id'];
}

export async function getProducersByOutputItem({ itemId }: GetProducersByOutputItemParams): Promise<Producer[]>
{
	return await db
		.selectDistinct({
			id: producersTable.id,
			name: producersTable.name,
			time: producersTable.time,
			inventoryId: producersTable.inventoryId,
		})
		.from(producersTable)
		.innerJoin(producerOutputsTable, eq(producerOutputsTable.producerId, producersTable.id))
		.where(eq(producerOutputsTable.itemId, itemId))
		.orderBy(asc(producersTable.name));
}
