'use server';

import { collectionsTable, foldersTable, itemsTable, recipesTable } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { Collection } from '@/domain/collection';
import { InventoryData } from '@/domain/inventory';
import db from '@/db/client';

export async function getInventoryData(collectionId: Collection['id']): Promise<InventoryData>
{
	const [[collection], items, folders] = await Promise.all([
		db.select().from(collectionsTable).where(eq(collectionsTable.id, collectionId)),
		db.select().from(itemsTable).where(eq(itemsTable.collectionId, collectionId)),
		db.select().from(foldersTable).where(eq(foldersTable.collectionId, collectionId)),
	]);

	const itemIds = items.map((item) => item.id);
	const recipes = await db.select().from(recipesTable).where(inArray(recipesTable.itemId, itemIds));

	return {
		collection,
		items,
		recipes,
		folders,
	};
}
