'use server';

import { foldersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

interface FolderOrder
{
	id: string;
	order: number;
}

interface MoveAndReorderFoldersArgs
{
	newParentFolderId: string | null;
	folderOrders: FolderOrder[];
}

export async function moveAndReorderFolders({ newParentFolderId, folderOrders }: MoveAndReorderFoldersArgs)
{
	await db.transaction(async (tx) =>
	{
		for (const { id, order } of folderOrders)
		{
			await tx.update(foldersTable).set({ parentFolderId: newParentFolderId, order }).where(eq(foldersTable.id, id));
		}
	});
}
