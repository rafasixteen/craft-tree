'use server';

import db from '@/db/client';
import { producerTagsTable, producersTable } from '@/db/schema';

import { Inventory } from '@/domain/inventory';
import { Producer, ProducerQueryOptions } from '@/domain/producer';

import { and, asc, desc, eq, exists, ilike, inArray } from 'drizzle-orm';

interface GetProducersParams
{
	inventoryId: Inventory['id'];
	options?: ProducerQueryOptions;
}

export async function getProducers({ inventoryId, options }: GetProducersParams): Promise<Producer[]>
{
	const filters = options?.filters;
	const sortBy = options?.sort ?? 'name_asc';

	const conditions = [eq(producersTable.inventoryId, inventoryId)];

	if (filters?.search?.trim())
	{
		conditions.push(ilike(producersTable.name, `%${filters.search.trim()}%`));
	}

	if (filters?.tagIds?.length)
	{
		conditions.push(
			exists(
				db
					.select()
					.from(producerTagsTable)
					.where(
						and(
							eq(producerTagsTable.producerId, producersTable.id),
							inArray(producerTagsTable.tagId, filters.tagIds),
						),
					),
			),
		);
	}

	const query = (() =>
	{
		const base = db
			.select()
			.from(producersTable)
			.where(and(...conditions));

		switch (sortBy)
		{
			case 'name_asc':
				return base.orderBy(asc(producersTable.name));
			case 'name_desc':
				return base.orderBy(desc(producersTable.name));
			default:
				return base.orderBy(asc(producersTable.name));
		}
	})();

	return await query;
}
