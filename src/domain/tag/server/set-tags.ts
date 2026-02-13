'use server';

import { itemTags } from '@/db/schema';
import { Item } from '@/domain/item';
import { Tag } from '@/domain/tag';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export interface SetTagsParams
{
	itemId: Item['id'];
	tagIds: Tag['id'][];
}

export async function setTags({ itemId, tagIds }: SetTagsParams): Promise<void>
{
	await db.delete(itemTags).where(eq(itemTags.itemId, itemId));
	await db.insert(itemTags).values(tagIds.map((tagId) => ({ itemId, tagId })));
}
