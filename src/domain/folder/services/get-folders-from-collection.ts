'use server';

import { eq } from 'drizzle-orm';
import { foldersTable } from '@/db/schema';
import { Folder } from '@/domain/folder';
import db from '@/db/client';

export async function getFoldersFromCollection(collectionId: string): Promise<Folder[]>
{
	return await db.select().from(foldersTable).where(eq(foldersTable.collectionId, collectionId));
}
