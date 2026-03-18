'use server';

import db from '@/db/client';
import { tagsTable } from '@/db/schema';

import { Tag } from '@/domain/tag';

import { eq } from 'drizzle-orm';

export async function getTagById(id: Tag['id']): Promise<Tag>
{
	const [tag] = await db.select().from(tagsTable).where(eq(tagsTable.id, id));
	return tag;
}
