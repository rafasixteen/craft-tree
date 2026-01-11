'use server';

import { Collection } from '@/domain/collection';
import { eq } from 'drizzle-orm';
import { collectionsTable } from '@/db/schema';
import db from '@/db/client';

export async function getUserCollections(userId: string): Promise<Collection[]>
{
	return await db.select().from(collectionsTable).where(eq(collectionsTable.userId, userId));
}
