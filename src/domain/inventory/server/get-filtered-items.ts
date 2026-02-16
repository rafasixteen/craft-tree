'use server';

import { inventories, items, itemTags } from '@/db/schema';
import { Item } from '@/domain/item';
import { Inventory } from '@/domain/inventory';
import { sql } from 'drizzle-orm';
import { Tag } from '@/domain/tag';
import db from '@/db/client';

interface Params
{
	inventoryId: Inventory['id'];
	tagIds?: Tag['id'][];
	searchTerm?: string;
}

export async function getFilteredInventoryItems({ inventoryId, tagIds, searchTerm }: Params): Promise<Item[]>
{
	const query = sql`
		SELECT DISTINCT i.*
		FROM ${items} i
		JOIN ${inventories} inv ON inv.id = i.inventory_id
		LEFT JOIN ${itemTags} it ON i.id = it.item_id
		WHERE inv.id = ${inventoryId}
		${searchTerm ? sql`AND i.name ILIKE ${'%' + searchTerm + '%'}` : sql``}
		${tagIds && tagIds.length > 0 ? sql`AND it.tag_id = ANY(${tagIds}::uuid[])` : sql``}
	`;

	const result = await db.execute(query);

	return result.rows as Item[];
}
