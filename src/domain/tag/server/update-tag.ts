'use server';

import { tags } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Tag } from '@/domain/tag';
import db from '@/db/client';

type UpdateTagParams = Pick<Tag, 'id' | 'name'>;

export async function updateTag({ id, name }: UpdateTagParams): Promise<Tag>
{
	const [tag] = await db.update(tags).set({ name }).where(eq(tags.id, id)).returning();
	return tag;
}
