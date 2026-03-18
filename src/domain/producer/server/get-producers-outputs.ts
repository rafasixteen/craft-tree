'use server';

import db from '@/db/client';
import { producerOutputsTable, producersTable } from '@/db/schema';

import { Inventory } from '@/domain/inventory';
import { ProducerOutput } from '@/domain/producer';

import { eq } from 'drizzle-orm';

interface GetProducersOutputsParams
{
	inventoryId: Inventory['id'];
}

export async function getProducersOutputs({ inventoryId }: GetProducersOutputsParams): Promise<ProducerOutput[]>
{
	const outputs = await db
		.select({
			id: producerOutputsTable.id,
			quantity: producerOutputsTable.quantity,
			itemId: producerOutputsTable.itemId,
			producerId: producerOutputsTable.producerId,
		})
		.from(producerOutputsTable)
		.innerJoin(producersTable, eq(producerOutputsTable.producerId, producersTable.id))
		.where(eq(producersTable.inventoryId, inventoryId));

	return outputs;
}
