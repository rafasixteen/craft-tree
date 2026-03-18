'use server';

import db from '@/db/client';
import { producersTable } from '@/db/schema';

import { Producer } from '@/domain/producer';

import { eq } from 'drizzle-orm';

export async function deleteProducer(id: Producer['id']): Promise<void>
{
	await db.delete(producersTable).where(eq(producersTable.id, id)).returning();
}
