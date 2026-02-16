'use server';

import { producers } from '@/db/schema';
import { Producer } from '@/domain/producer';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export interface DeleteProducerParams
{
	producerId: Producer['id'];
}

export async function deleteProducer({ producerId }: DeleteProducerParams): Promise<void>
{
	await db.delete(producers).where(eq(producers.id, producerId)).returning();
}
