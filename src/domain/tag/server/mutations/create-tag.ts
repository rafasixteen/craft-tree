'use server';

import db from '@/db/client';
import { tagsTable } from '@/db/schema';

import { Tag } from '@/domain/tag';

type CreateTagParams = Omit<Tag, 'id'>;

export async function createTag({ name, inventoryId }: CreateTagParams): Promise<Tag>
{
	const [tag] = await db.insert(tagsTable).values({ name, inventoryId }).returning();
	return tag;
}
