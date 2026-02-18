'use server';

import { producerOutputs } from '@/db/schema';
import { Producer, ProducerOutput } from '@/domain/producer';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function getProducerOutputs(id: Producer['id']): Promise<ProducerOutput[]>
{
	return db.select().from(producerOutputs).where(eq(producerOutputs.producerId, id));
}
