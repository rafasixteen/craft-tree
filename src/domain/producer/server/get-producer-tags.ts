'use server';

import { producerTags } from '@/db/schema';
import { Producer, ProducerTag } from '@/domain/producer';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function getProducerTags(id: Producer['id']): Promise<ProducerTag[]>
{
	return db.select().from(producerTags).where(eq(producerTags.producerId, id));
}
