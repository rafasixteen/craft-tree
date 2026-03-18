'use server';

import db from '@/db/client';
import { producerTagsTable } from '@/db/schema';

import { Producer, ProducerTag } from '@/domain/producer';

import { eq } from 'drizzle-orm';

export async function getProducerTags(id: Producer['id']): Promise<ProducerTag[]>
{
	return db.select().from(producerTagsTable).where(eq(producerTagsTable.producerId, id));
}
