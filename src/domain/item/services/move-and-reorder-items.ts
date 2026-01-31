'use server';

import { itemsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

interface ItemOrder
{
	id: string;
	order: number;
}

interface MoveAndReorderItemsArgs
{
	newFolderId: string | null;
	itemOrders: ItemOrder[];
}

export async function moveAndReorderItems({ newFolderId, itemOrders }: MoveAndReorderItemsArgs)
{
	await db.transaction(async (tx) =>
	{
		for (const { id, order } of itemOrders)
		{
			await tx.update(itemsTable).set({ folderId: newFolderId, order }).where(eq(itemsTable.id, id));
		}
	});
}
