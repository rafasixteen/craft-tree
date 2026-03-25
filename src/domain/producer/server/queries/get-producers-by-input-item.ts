'use server';

import db from '@/db/client';
import { producerInputsTable, producersTable } from '@/db/schema';

import { Item } from '@/domain/item';
import { Producer } from '@/domain/producer';

import { asc, eq } from 'drizzle-orm';

interface GetProducersByInputItemParams
{
	itemId: Item['id'];
}

export async function getProducersByInputItem({ itemId }: GetProducersByInputItemParams): Promise<Producer[]>
{
	return await db
		.select({
			id: producersTable.id,
			name: producersTable.name,
			time: producersTable.time,
			inventoryId: producersTable.inventoryId,
		})
		.from(producersTable)
		.innerJoin(producerInputsTable, eq(producerInputsTable.producerId, producersTable.id))
		.where(eq(producerInputsTable.itemId, itemId))
		.orderBy(asc(producersTable.name));
}
