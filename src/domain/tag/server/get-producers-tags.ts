'use server';

import { eq } from 'drizzle-orm';
import { producerTags, tags } from '@/db/schema';
import { ProducerTag } from '@/domain/producer';
import { Inventory } from '@/domain/inventory';
import db from '@/db/client';

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
