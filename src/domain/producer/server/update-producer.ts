'use server';

import db from '@/db/client';
import { producers } from '@/db/schema';

import { Producer } from '@/domain/producer';

import { eq } from 'drizzle-orm';

type UpdateProducerParams = Pick<Producer, 'id'> & Partial<Omit<Producer, 'id' | 'inventoryId'>>;

export async function updateProducer({ id, name, time }: UpdateProducerParams): Promise<Producer>
{
	const [producer] = await db.update(producers).set({ name, time }).where(eq(producers.id, id)).returning();
	return producer;
}
