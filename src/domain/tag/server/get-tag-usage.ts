'use server';

import db from '@/db/client';
import { itemTagsTable, producerTagsTable } from '@/db/schema';

import { Tag } from '@/domain/tag';

import { count, eq } from 'drizzle-orm';

export async function getTagUsage(tagId: Tag['id'])
{
	const [itemResult, producerResult] = await Promise.all([
		db.select({ count: count() }).from(itemTagsTable).where(eq(itemTagsTable.tagId, tagId)),
		db.select({ count: count() }).from(producerTagsTable).where(eq(producerTagsTable.tagId, tagId)),
	]);

	const items = itemResult[0]?.count ?? 0;
	const producers = producerResult[0]?.count ?? 0;

	return {
		items,
		producers,
		total: items + producers,
	};
}
