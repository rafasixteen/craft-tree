'use server';

import { Item } from '@/domain/item';
import { producerOutputs, producers } from '@/db/schema';
import { Producer } from '@/domain/producer';
import { asc, eq } from 'drizzle-orm';
import db from '@/db/client';

interface GetProducersByOutputItemParams
{
	itemId: Item['id'];
}

export async function getProducersByOutputItem({ itemId }: GetProducersByOutputItemParams): Promise<Producer[]>
{
	return await db
		.selectDistinct({
			id: producers.id,
			name: producers.name,
			time: producers.time,
			inventoryId: producers.inventoryId,
		})
		.from(producers)
		.innerJoin(producerOutputs, eq(producerOutputs.producerId, producers.id))
		.where(eq(producerOutputs.itemId, itemId))
		.orderBy(asc(producers.name));
}
