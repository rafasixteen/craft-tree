'use server';

import db from '@/db/client';
import { producersTable } from '@/db/schema';

import { Producer } from '@/domain/producer';

import { eq } from 'drizzle-orm';

type UpdateProducerParams = Pick<Producer, 'id'> & Partial<Omit<Producer, 'id' | 'inventoryId'>>;

export async function updateProducer({ id, name, time }: UpdateProducerParams): Promise<Producer>
{
	const [producer] = await db.update(producersTable).set({ name, time }).where(eq(producersTable.id, id)).returning();
	return producer;
}
