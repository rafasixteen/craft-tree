'use server';

import db from '@/db/client';
import { tagsTable } from '@/db/schema';

import { Inventory } from '@/domain/inventory';
import { Tag, TagQueryOptions } from '@/domain/tag';

import { and, asc, desc, eq, ilike } from 'drizzle-orm';

export interface GetTagsParams
{
	inventoryId: Inventory['id'];
	options?: TagQueryOptions;
}

export async function getTags({ inventoryId, options }: GetTagsParams): Promise<Tag[]>
{
	const filters = options?.filters;
	const sortBy = options?.sort ?? 'name_asc';

	const conditions = [eq(tagsTable.inventoryId, inventoryId)];

	if (filters?.search?.trim())
	{
		conditions.push(ilike(tagsTable.name, `%${filters.search.trim()}%`));
	}

	const query = (() =>
	{
		const base = db
			.select()
			.from(tagsTable)
			.where(and(...conditions));

		switch (sortBy)
		{
			case 'name_asc':
				return base.orderBy(asc(tagsTable.name));
			case 'name_desc':
				return base.orderBy(desc(tagsTable.name));
			default:
				return base.orderBy(asc(tagsTable.name));
		}
	})();

	return await query;
}
