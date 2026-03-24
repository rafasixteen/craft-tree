'use server';

import db from '@/db/client';
import { tagsTable } from '@/db/schema';

import { Tag } from '@/domain/tag';

import { eq } from 'drizzle-orm';

type UpdateTagParams = Pick<Tag, 'id' | 'name'>;

export async function updateTag({ id, name }: UpdateTagParams): Promise<Tag>
{
	const [tag] = await db.update(tagsTable).set({ name }).where(eq(tagsTable.id, id)).returning();
	return tag;
}
