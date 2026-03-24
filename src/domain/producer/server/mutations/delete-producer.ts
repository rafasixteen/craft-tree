'use server';

import db from '@/db/client';
import { producersTable } from '@/db/schema';

import { Producer } from '@/domain/producer';

import { eq } from 'drizzle-orm';

interface DeleteProducerParams
{
	producerId: Producer['id'];
}

export async function deleteProducer({ producerId }: DeleteProducerParams): Promise<void>
{
	await db.delete(producersTable).where(eq(producersTable.id, producerId));
}
