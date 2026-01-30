'use server';

import { itemsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

interface ReorderItemsArgs
{
	folderId: string | null;
	orderedItemIds: string[];
}

export async function reorderItems({ folderId, orderedItemIds }: ReorderItemsArgs)
{
	await db.transaction(async (tx) =>
	{
		for (let i = 0; i < orderedItemIds.length; i++)
		{
			await tx.update(itemsTable).set({ folderId, order: i }).where(eq(itemsTable.id, orderedItemIds[i]));
		}
	});
}
