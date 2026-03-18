'use server';

import { tags } from '@/db/schema';
import { Tag, TagQueryOptions } from '@/domain/tag';
import { Inventory } from '@/domain/inventory';
import { asc, desc, and, eq, ilike } from 'drizzle-orm';
import db from '@/db/client';

export interface GetTagsParams
{
	inventoryId: Inventory['id'];
	options?: TagQueryOptions;
}

export async function getTags({
	inventoryId,
	options,
}: GetTagsParams): Promise<Tag[]>
{
	const filters = options?.filters;
	const sortBy = options?.sort ?? 'name_asc';

	const conditions = [eq(tags.inventoryId, inventoryId)];

	if (filters?.search?.trim())
	{
		conditions.push(ilike(tags.name, `%${filters.search.trim()}%`));
	}

	const query = (() =>
	{
		const base = db
			.select()
			.from(tags)
			.where(and(...conditions));

		switch (sortBy)
		{
			case 'name_asc':
				return base.orderBy(asc(tags.name));
			case 'name_desc':
				return base.orderBy(desc(tags.name));
			default:
				return base.orderBy(asc(tags.name));
		}
	})();

	return await query;
}
