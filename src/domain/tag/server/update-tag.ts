'use server';

import db from '@/db/client';
import { tags } from '@/db/schema';

import { Tag } from '@/domain/tag';

import { eq } from 'drizzle-orm';

type UpdateTagParams = Pick<Tag, 'id' | 'name'>;

export async function updateTag({ id, name }: UpdateTagParams): Promise<Tag>
{
	const [tag] = await db.update(tags).set({ name }).where(eq(tags.id, id)).returning();
	return tag;
}
