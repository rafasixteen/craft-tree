'use server';

import db from '@/db/client';
import { producerOutputsTable } from '@/db/schema';

import { Producer, ProducerOutput } from '@/domain/producer';

import { eq } from 'drizzle-orm';

interface GetProducerOutputsParams
{
	producerId: Producer['id'];
}

export async function getProducerOutputs({ producerId }: GetProducerOutputsParams): Promise<ProducerOutput[]>
{
	return db.select().from(producerOutputsTable).where(eq(producerOutputsTable.producerId, producerId));
}
