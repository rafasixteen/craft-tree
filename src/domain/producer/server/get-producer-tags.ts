'use server';

import db from '@/db/client';
import { producerTags } from '@/db/schema';

import { Producer, ProducerTag } from '@/domain/producer';

import { eq } from 'drizzle-orm';

export async function getProducerTags(id: Producer['id']): Promise<ProducerTag[]>
{
	return db.select().from(producerTags).where(eq(producerTags.producerId, id));
}
