'use server';

import { tags } from '@/db/schema';
import { Tag } from '@/domain/tag';
import db from '@/db/client';

export interface CreateTagParams
{
	name: Tag['name'];
	inventoryId: Tag['inventoryId'];
}

export async function createTag({ name, inventoryId }: CreateTagParams): Promise<Tag>
{
	const [tag] = await db.insert(tags).values({ name, inventoryId }).returning();
	return tag;
}
