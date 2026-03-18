'use server';

import db from '@/db/client';
import { producerInputs, producers } from '@/db/schema';

import { Inventory } from '@/domain/inventory';
import { ProducerInput } from '@/domain/producer';

import { eq } from 'drizzle-orm';

interface GetProducersInputsParams
{
	inventoryId: Inventory['id'];
}

export async function getProducersInputs({ inventoryId }: GetProducersInputsParams): Promise<ProducerInput[]>
{
	const inputs = await db
		.select({
			id: producerInputs.id,
			quantity: producerInputs.quantity,
			itemId: producerInputs.itemId,
			producerId: producerInputs.producerId,
		})
		.from(producerInputs)
		.innerJoin(producers, eq(producerInputs.producerId, producers.id))
		.where(eq(producers.inventoryId, inventoryId));

	return inputs;
}
