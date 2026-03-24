'use server';

import db from '@/db/client';
import { producerTagsTable } from '@/db/schema';

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
		await tx.delete(producerTagsTable).where(eq(producerTagsTable.producerId, producerId));

		if (tagIds.length === 0)
		{
			return [];
		}

		return await tx
			.insert(producerTagsTable)
			.values(
				tagIds.map((tagId) => ({
					producerId,
					tagId,
				})),
			)
			.returning();
	});
}
