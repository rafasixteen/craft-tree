'use server';

import db from '@/db/client';
import { producerInputsTable } from '@/db/schema';

import { Producer, ProducerInput } from '@/domain/producer';

import { eq } from 'drizzle-orm';

interface GetProducerInputsParams
{
	producerId: Producer['id'];
}

export async function getProducerInputs({ producerId }: GetProducerInputsParams): Promise<ProducerInput[]>
{
	return db.select().from(producerInputsTable).where(eq(producerInputsTable.producerId, producerId));
}
