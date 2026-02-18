'use server';

import { tags } from '@/db/schema';
import { Tag } from '@/domain/tag';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function deleteTag(id: Tag['id']): Promise<Tag>
{
	const [tag] = await db.delete(tags).where(eq(tags.id, id)).returning();
	return tag;
}
