'use server';

import db from '@/db/client';
import { producersTable } from '@/db/schema';

import { Producer } from '@/domain/producer';

type CreateProducerParams = Omit<Producer, 'id'>;

export async function createProducer({ name, time, inventoryId }: CreateProducerParams): Promise<Producer>
{
	const [producer] = await db.insert(producersTable).values({ name, time, inventoryId }).returning();
	return producer;
}
