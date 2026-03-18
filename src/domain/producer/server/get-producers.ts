'use server';

import { producers, producerTags } from '@/db/schema';
import { Producer, ProducerQueryOptions } from '@/domain/producer';
import { Inventory } from '@/domain/inventory';
import { asc, desc, and, eq, ilike, exists, inArray } from 'drizzle-orm';
import db from '@/db/client';

interface GetProducersParams
{
	inventoryId: Inventory['id'];
	options?: ProducerQueryOptions;
}

export async function getProducers({
	inventoryId,
	options,
}: GetProducersParams): Promise<Producer[]>
{
	const filters = options?.filters;
	const sortBy = options?.sort ?? 'name_asc';

	const conditions = [eq(producers.inventoryId, inventoryId)];

	if (filters?.search?.trim())
	{
		conditions.push(ilike(producers.name, `%${filters.search.trim()}%`));
	}

	if (filters?.tagIds?.length)
	{
		conditions.push(
			exists(
				db
					.select()
					.from(producerTags)
					.where(
						and(
							eq(producerTags.producerId, producers.id),
							inArray(producerTags.tagId, filters.tagIds),
						),
					),
			),
		);
	}

	const query = (() =>
	{
		const base = db
			.select()
			.from(producers)
			.where(and(...conditions));

		switch (sortBy)
		{
			case 'name_asc':
				return base.orderBy(asc(producers.name));
			case 'name_desc':
				return base.orderBy(desc(producers.name));
			default:
				return base.orderBy(asc(producers.name));
		}
	})();

	return await query;
}
