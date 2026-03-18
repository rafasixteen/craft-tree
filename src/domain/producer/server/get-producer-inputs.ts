'use server';

import db from '@/db/client';
import { producerInputsTable } from '@/db/schema';

import { Producer, ProducerInput } from '@/domain/producer';

import { eq } from 'drizzle-orm';

export async function getProducerInputs(id: Producer['id']): Promise<ProducerInput[]>
{
	return db.select().from(producerInputsTable).where(eq(producerInputsTable.producerId, id));
}
