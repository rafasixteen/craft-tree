'use server';

import { producerOutputs, producers } from '@/db/schema';
import { ProducerOutput } from '@/domain/producer';
import { eq } from 'drizzle-orm';
import { Inventory } from '@/domain/inventory';
import db from '@/db/client';

interface GetProducersOutputsParams
{
	inventoryId: Inventory['id'];
}

export async function getProducersOutputs({
	inventoryId,
}: GetProducersOutputsParams): Promise<ProducerOutput[]>
{
	const outputs = await db
		.select({
			id: producerOutputs.id,
			quantity: producerOutputs.quantity,
			itemId: producerOutputs.itemId,
			producerId: producerOutputs.producerId,
		})
		.from(producerOutputs)
		.innerJoin(producers, eq(producerOutputs.producerId, producers.id))
		.where(eq(producers.inventoryId, inventoryId));

	return outputs;
}
