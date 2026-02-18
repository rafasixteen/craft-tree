'use server';

import { producers } from '@/db/schema';
import { Producer } from '@/domain/producer';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function deleteProducer(id: Producer['id']): Promise<void>
{
	await db.delete(producers).where(eq(producers.id, id)).returning();
}
