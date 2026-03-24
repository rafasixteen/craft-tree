'use server';

import db from '@/db/client';
import { producerOutputsTable } from '@/db/schema';

import { Producer, ProducerOutput } from '@/domain/producer';

import { eq } from 'drizzle-orm';

type Output = Omit<ProducerOutput, 'id' | 'producerId'>;

interface SetProducerOutputsParams
{
	producerId: Producer['id'];
	outputs: Output[];
}

export async function setProducerOutputs({ producerId, outputs }: SetProducerOutputsParams): Promise<ProducerOutput[]>
{
	return db.transaction(async (tx) =>
	{
		await tx.delete(producerOutputsTable).where(eq(producerOutputsTable.producerId, producerId));

		if (outputs.length === 0)
		{
			return [];
		}

		return await tx
			.insert(producerOutputsTable)
			.values(
				outputs.map((input) => ({
					...input,
					producerId,
				})),
			)
			.returning();
	});
}
