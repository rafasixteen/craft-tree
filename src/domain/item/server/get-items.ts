'use server';

import db from '@/db/client';
import { itemTags, items } from '@/db/schema';

import { Inventory } from '@/domain/inventory';
import { Item, ItemQueryOptions } from '@/domain/item';

import { and, asc, desc, eq, exists, ilike, inArray } from 'drizzle-orm';

interface GetItemsParams
{
	inventoryId: Inventory['id'];
	options?: ItemQueryOptions;
}

export async function getItems({ inventoryId, options }: GetItemsParams): Promise<Item[]>
{
	const filters = options?.filters;
	const sortBy = options?.sort ?? 'name_asc';

	const conditions = [eq(items.inventoryId, inventoryId)];

	if (filters?.search?.trim())
	{
		conditions.push(ilike(items.name, `%${filters.search.trim()}%`));
	}

	if (filters?.tagIds?.length)
	{
		conditions.push(
			exists(
				db
					.select()
					.from(itemTags)
					.where(and(eq(itemTags.itemId, items.id), inArray(itemTags.tagId, filters.tagIds))),
			),
		);
	}

	const query = (() =>
	{
		const base = db
			.select()
			.from(items)
			.where(and(...conditions));

		switch (sortBy)
		{
			case 'name_asc':
				return base.orderBy(asc(items.name));
			case 'name_desc':
				return base.orderBy(desc(items.name));
			default:
				return base.orderBy(asc(items.name));
		}
	})();

	return await query;
}
