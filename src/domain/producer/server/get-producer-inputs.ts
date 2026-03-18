'use server';

import { producerInputs } from '@/db/schema';
import { Producer, ProducerInput } from '@/domain/producer';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function getProducerInputs(
	id: Producer['id'],
): Promise<ProducerInput[]>
{
	return db
		.select()
		.from(producerInputs)
		.where(eq(producerInputs.producerId, id));
}
