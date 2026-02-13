'use server';

import { tags } from '@/db/schema';
import { Tag } from '@/domain/tag';
import db from '@/db/client';
import { eq } from 'drizzle-orm';

export interface DeleteTagParams
{
	tagId: Tag['id'];
}

export async function deleteTag({ tagId }: DeleteTagParams): Promise<Tag>
{
	const [tag] = await db.delete(tags).where(eq(tags.id, tagId)).returning();
	return tag;
}
