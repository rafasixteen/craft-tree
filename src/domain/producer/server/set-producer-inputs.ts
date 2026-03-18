'use server';

import db from '@/db/client';
import { producerInputsTable } from '@/db/schema';

import { Producer, ProducerInput } from '@/domain/producer';

import { eq } from 'drizzle-orm';

type Input = Omit<ProducerInput, 'id' | 'producerId'>;

interface SetProducerInputsParams
{
	producerId: Producer['id'];
	inputs: Input[];
}

export async function setProducerInputs({ producerId, inputs }: SetProducerInputsParams): Promise<ProducerInput[]>
{
	return db.transaction(async (tx) =>
	{
		await tx.delete(producerInputsTable).where(eq(producerInputsTable.producerId, producerId));

		if (inputs.length === 0)
		{
			return [];
		}

		return await tx
			.insert(producerInputsTable)
			.values(
				inputs.map((input) => ({
					...input,
					producerId,
				})),
			)
			.returning();
	});
}
