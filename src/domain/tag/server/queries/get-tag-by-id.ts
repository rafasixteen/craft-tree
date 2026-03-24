'use server';

import db from '@/db/client';
import { tagsTable } from '@/db/schema';

import { Tag } from '@/domain/tag';

import { eq } from 'drizzle-orm';

interface GetTagByIdParams
{
	tagId: Tag['id'];
}

export async function getTagById({ tagId }: GetTagByIdParams): Promise<Tag>
{
	const [tag] = await db.select().from(tagsTable).where(eq(tagsTable.id, tagId));
	return tag;
}
