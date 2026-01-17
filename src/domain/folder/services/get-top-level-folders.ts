'use server';

import { foldersTable } from '@/db/schema';
import { Folder } from '@/domain/folder';
import db from '@/db/client';
import { eq, and, isNull } from 'drizzle-orm';

export async function getTopLevelFolders(collectionId: string): Promise<Folder[]>
{
	return await db
		.select()
		.from(foldersTable)
		.where(and(eq(foldersTable.collectionId, collectionId), isNull(foldersTable.parentFolderId)));
}
