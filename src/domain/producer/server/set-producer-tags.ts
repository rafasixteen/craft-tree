'use server';

import { producerTags } from '@/db/schema';
import { Producer } from '@/domain/producer';
import { Tag } from '@/domain/tag';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export interface SetProducerTagsParams
{
	producerId: Producer['id'];
	tagIds: Tag['id'][];
}

export async function setProducerTags({ producerId, tagIds }: SetProducerTagsParams): Promise<void>
{
	await db.delete(producerTags).where(eq(producerTags.producerId, producerId));
	await db.insert(producerTags).values(tagIds.map((tagId) => ({ producerId, tagId })));
}
