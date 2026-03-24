'use server';

import db from '@/db/client';
import { producerTagsTable } from '@/db/schema';

import { Producer, ProducerTag } from '@/domain/producer';

import { eq } from 'drizzle-orm';

interface GetProducerTagsParams
{
	producerId: Producer['id'];
}

export async function getProducerTags({ producerId }: GetProducerTagsParams): Promise<ProducerTag[]>
{
	return db.select().from(producerTagsTable).where(eq(producerTagsTable.producerId, producerId));
}
