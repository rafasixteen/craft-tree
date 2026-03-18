'use server';

import db from '@/db/client';
import { producerTags, tags } from '@/db/schema';

import { Inventory } from '@/domain/inventory';
import { ProducerTag } from '@/domain/producer';

import { eq } from 'drizzle-orm';

interface GetProducersTagsParams
{
	inventoryId: Inventory['id'];
}

export async function getProducersTags({ inventoryId }: GetProducersTagsParams): Promise<ProducerTag[]>
{
	return await db
		.select({
			producerId: producerTags.producerId,
			tagId: producerTags.tagId,
		})
		.from(producerTags)
		.innerJoin(tags, eq(producerTags.tagId, tags.id))
		.where(eq(tags.inventoryId, inventoryId));
}
