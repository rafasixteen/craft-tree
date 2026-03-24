'use server';

import db from '@/db/client';
import { producerInputsTable, producersTable } from '@/db/schema';

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
			id: producerInputsTable.id,
			quantity: producerInputsTable.quantity,
			itemId: producerInputsTable.itemId,
			producerId: producerInputsTable.producerId,
		})
		.from(producerInputsTable)
		.innerJoin(producersTable, eq(producerInputsTable.producerId, producersTable.id))
		.where(eq(producersTable.inventoryId, inventoryId));

	return inputs;
}
