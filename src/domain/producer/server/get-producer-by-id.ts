'use server';

import { producers } from '@/db/schema';
import { Producer } from '@/domain/producer';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function getProducerById(id: Producer['id']): Promise<Producer>
{
	const [producer] = await db
		.select()
		.from(producers)
		.where(eq(producers.id, id));
	return producer;
}
