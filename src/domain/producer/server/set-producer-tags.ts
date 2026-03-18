'use server';

import db from '@/db/client';
import { producerTags } from '@/db/schema';

import { Tag } from '@/domain/tag';
import { Producer, ProducerTag } from '@/domain/producer';

import { eq } from 'drizzle-orm';

interface SetProducerTagsParams
{
	producerId: Producer['id'];
	tagIds: Tag['id'][];
}

export async function setProducerTags({ producerId, tagIds }: SetProducerTagsParams): Promise<ProducerTag[]>
{
	return db.transaction(async (tx) =>
	{
		await tx.delete(producerTags).where(eq(producerTags.producerId, producerId));

		if (tagIds.length === 0)
		{
			return [];
		}

		return await tx
			.insert(producerTags)
			.values(
				tagIds.map((tagId) => ({
					producerId,
					tagId,
				})),
			)
			.returning();
	});
}
