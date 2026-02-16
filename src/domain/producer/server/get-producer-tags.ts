'use server';

import { producerTags } from '@/db/schema';
import { Producer, ProducerTag } from '@/domain/producer';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export interface GetProducerTagsParams
{
	producerId: Producer['id'];
}

export async function getProducerTags({ producerId }: GetProducerTagsParams): Promise<ProducerTag[]>
{
	return db.select().from(producerTags).where(eq(producerTags.producerId, producerId));
}
