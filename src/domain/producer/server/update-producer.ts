'use server';

import { producers, producerInputs, producerOutputs } from '@/db/schema';
import { Producer, ProducerInput, ProducerOutput } from '@/domain/producer';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

type UpdateProducer = Partial<Omit<Producer, 'id' | 'inventoryId' | 'inputs' | 'outputs'>>;

export interface UpdateProducerParams extends UpdateProducer
{
	id: Producer['id'];
	inputs?: ProducerInput[] | null;
	outputs?: ProducerOutput[] | null;
}

export async function updateProducer({ id, name, time, inputs, outputs }: UpdateProducerParams): Promise<Producer>
{
	return db.transaction(async (tx) =>
	{
		// Update producer basic fields
		const [producer] = await tx.update(producers).set({ name, time }).where(eq(producers.id, id)).returning();

		let createdInputs: ProducerInput[] = [];
		let createdOutputs: ProducerOutput[] = [];

		// Handle inputs
		if (inputs !== undefined)
		{
			// Delete existing inputs first
			await tx.delete(producerInputs).where(eq(producerInputs.producerId, id));

			if (inputs !== null && inputs.length > 0)
			{
				// Re-insert new inputs and capture DB-generated IDs
				createdInputs = await tx
					.insert(producerInputs)
					.values(
						inputs.map((input) => ({
							quantity: input.quantity,
							itemId: input.itemId,
							producerId: producer.id,
						})),
					)
					.returning();
			}
		}
		else
		{
			// If undefined, keep existing inputs (fetch them to return)
			createdInputs = await tx.select().from(producerInputs).where(eq(producerInputs.producerId, id));
		}

		// Handle outputs
		if (outputs !== undefined)
		{
			// Delete existing outputs first
			await tx.delete(producerOutputs).where(eq(producerOutputs.producerId, id));

			if (outputs !== null && outputs.length > 0)
			{
				// Re-insert new outputs and capture DB-generated IDs
				createdOutputs = await tx
					.insert(producerOutputs)
					.values(
						outputs.map((output) => ({
							quantity: output.quantity,
							itemId: output.itemId,
							producerId: producer.id,
						})),
					)
					.returning();
			}
		}
		else
		{
			// If undefined, keep existing outputs (fetch them to return)
			createdOutputs = await tx.select().from(producerOutputs).where(eq(producerOutputs.producerId, id));
		}

		// Return fully hydrated producer
		return {
			...producer,
			inputs: createdInputs,
			outputs: createdOutputs,
		};
	});
}
