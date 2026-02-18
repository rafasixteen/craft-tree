'use server';

import { producerOutputs } from '@/db/schema';
import { Producer, ProducerOutput } from '@/domain/producer';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

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
		await tx.delete(producerOutputs).where(eq(producerOutputs.producerId, producerId));

		if (outputs.length === 0)
		{
			return [];
		}

		return await tx
			.insert(producerOutputs)
			.values(
				outputs.map((input) => ({
					...input,
					producerId,
				})),
			)
			.returning();
	});
}
