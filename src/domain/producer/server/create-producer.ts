'use server';

import { producers } from '@/db/schema';
import { Producer } from '@/domain/producer';
import db from '@/db/client';

type CreateProducerParams = Omit<Producer, 'id'>;

export async function createProducer({ name, time, inventoryId }: CreateProducerParams): Promise<Producer>
{
	const [producer] = await db.insert(producers).values({ name, time, inventoryId }).returning();
	return producer;
}
