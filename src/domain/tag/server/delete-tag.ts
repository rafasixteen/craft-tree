'use server';

import db from '@/db/client';
import { tagsTable } from '@/db/schema';

import { Tag } from '@/domain/tag';

import { eq } from 'drizzle-orm';

export async function deleteTag(id: Tag['id']): Promise<Tag>
{
	const [tag] = await db.delete(tagsTable).where(eq(tagsTable.id, id)).returning();
	return tag;
}
