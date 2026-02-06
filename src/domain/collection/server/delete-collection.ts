'use server';

import { collectionsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function deleteCollection(collectionId: string)
{
	await db.delete(collectionsTable).where(eq(collectionsTable.id, collectionId));
}
