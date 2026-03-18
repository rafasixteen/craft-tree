'use server';

import db from '@/db/client';
import { tags } from '@/db/schema';

import { Tag } from '@/domain/tag';

type CreateTagParams = Omit<Tag, 'id'>;

export async function createTag({ name, inventoryId }: CreateTagParams): Promise<Tag>
{
	const [tag] = await db.insert(tags).values({ name, inventoryId }).returning();
	return tag;
}
