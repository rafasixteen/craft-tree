'use server';

import db from '@/db/client';
import { producerOutputs } from '@/db/schema';

import { Producer, ProducerOutput } from '@/domain/producer';

import { eq } from 'drizzle-orm';

export async function getProducerOutputs(id: Producer['id']): Promise<ProducerOutput[]>
{
	return db.select().from(producerOutputs).where(eq(producerOutputs.producerId, id));
}
