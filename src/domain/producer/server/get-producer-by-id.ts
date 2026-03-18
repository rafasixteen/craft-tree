'use server';

import db from '@/db/client';
import { producers } from '@/db/schema';

import { Producer } from '@/domain/producer';

import { eq } from 'drizzle-orm';

export async function getProducerById(id: Producer['id']): Promise<Producer>
{
	const [producer] = await db.select().from(producers).where(eq(producers.id, id));
	return producer;
}
