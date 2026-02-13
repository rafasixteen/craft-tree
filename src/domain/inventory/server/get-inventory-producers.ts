'use server';

import { producers, producerInputs, producerOutputs } from '@/db/schema';
import { Inventory } from '@/domain/inventory';
import { Producer } from '@/domain/producer';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function getInventoryProducers(inventoryId: Inventory['id']): Promise<Producer[]>
{
	const rows = await db
		.select({
			producer: producers,
			input: producerInputs,
			output: producerOutputs,
		})
		.from(producers)
		.leftJoin(producerInputs, eq(producerInputs.producerId, producers.id))
		.leftJoin(producerOutputs, eq(producerOutputs.producerId, producers.id))
		.where(eq(producers.inventoryId, inventoryId));

	const map = new Map<Producer['id'], Producer>();

	for (const row of rows)
	{
		const id = row.producer.id;

		if (!map.has(id))
		{
			map.set(id, {
				...row.producer,
				inputs: [],
				outputs: [],
			});
		}

		if (row.input)
		{
			map.get(id)!.inputs.push(row.input);
		}

		if (row.output)
		{
			map.get(id)!.outputs.push(row.output);
		}
	}

	return [...map.values()];
}
