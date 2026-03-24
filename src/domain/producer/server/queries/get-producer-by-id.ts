'use server';

import db from '@/db/client';
import { producersTable } from '@/db/schema';

import { Producer } from '@/domain/producer';

import { eq } from 'drizzle-orm';

interface GetProducerByIdParams
{
	producerId: Producer['id'];
}

export async function getProducerById({ producerId }: GetProducerByIdParams): Promise<Producer>
{
	const [producer] = await db.select().from(producersTable).where(eq(producersTable.id, producerId));
	return producer;
}
