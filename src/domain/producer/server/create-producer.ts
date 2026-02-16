'use server';

import { producers, producerInputs, producerOutputs } from '@/db/schema';
import { Producer, ProducerInput, ProducerOutput } from '@/domain/producer';
import db from '@/db/client';

type CreateProducer = Omit<Producer, 'id' | 'inputs' | 'outputs'>;

export interface CreateProducerParams extends CreateProducer
{
	inputs?: ProducerInput[];
	outputs?: ProducerOutput[];
}

export async function createProducer({ name, time, inventoryId, inputs, outputs }: CreateProducerParams): Promise<Producer>
{
	return db.transaction(async (tx) =>
	{
		const [producer] = await tx
			.insert(producers)
			.values({
				name,
				time,
				inventoryId,
			})
			.returning();

		const createdInputs =
			inputs && inputs.length > 0
				? await tx
						.insert(producerInputs)
						.values(
							inputs.map((input) => ({
								quantity: input.quantity,
								itemId: input.itemId,
								producerId: producer.id,
							})),
						)
						.returning()
				: [];

		const createdOutputs =
			outputs && outputs.length > 0
				? await tx
						.insert(producerOutputs)
						.values(
							outputs.map((output) => ({
								quantity: output.quantity,
								itemId: output.itemId,
								producerId: producer.id,
							})),
						)
						.returning()
				: [];

		return {
			...producer,
			inputs: createdInputs,
			outputs: createdOutputs,
		};
	});
}
