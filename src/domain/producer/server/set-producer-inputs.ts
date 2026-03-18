'use server';

import { producerInputs } from '@/db/schema';
import { Producer, ProducerInput } from '@/domain/producer';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

type Input = Omit<ProducerInput, 'id' | 'producerId'>;

interface SetProducerInputsParams
{
	producerId: Producer['id'];
	inputs: Input[];
}

export async function setProducerInputs({
	producerId,
	inputs,
}: SetProducerInputsParams): Promise<ProducerInput[]>
{
	return db.transaction(async (tx) =>
	{
		await tx
			.delete(producerInputs)
			.where(eq(producerInputs.producerId, producerId));

		if (inputs.length === 0)
		{
			return [];
		}

		return await tx
			.insert(producerInputs)
			.values(
				inputs.map((input) => ({
					...input,
					producerId,
				})),
			)
			.returning();
	});
}
