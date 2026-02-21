'use server';

import { eq, count } from 'drizzle-orm';
import { itemTags, producerTags } from '@/db/schema';
import { Tag } from '@/domain/tag';
import db from '@/db/client';

export async function getTagUsage(tagId: Tag['id'])
{
	const [itemResult, producerResult] = await Promise.all([
		db.select({ count: count() }).from(itemTags).where(eq(itemTags.tagId, tagId)),
		db.select({ count: count() }).from(producerTags).where(eq(producerTags.tagId, tagId)),
	]);

	const items = itemResult[0]?.count ?? 0;
	const producers = producerResult[0]?.count ?? 0;

	return {
		items,
		producers,
		total: items + producers,
	};
}
