'use server';

import { foldersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

interface ReorderFoldersArgs
{
	parentFolderId: string | null;
	orderedFolderIds: string[];
}

export async function reorderFolders({ parentFolderId, orderedFolderIds }: ReorderFoldersArgs)
{
	await db.transaction(async (tx) =>
	{
		for (let i = 0; i < orderedFolderIds.length; i++)
		{
			await tx.update(foldersTable).set({ parentFolderId, order: i }).where(eq(foldersTable.id, orderedFolderIds[i]));
		}
	});
}
