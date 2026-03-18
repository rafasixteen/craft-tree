'use server';

import db from '@/db/client';
import { tags } from '@/db/schema';

import { Tag } from '@/domain/tag';

import { eq } from 'drizzle-orm';

export async function getTagById(id: Tag['id']): Promise<Tag>
{
	const [tag] = await db.select().from(tags).where(eq(tags.id, id));
	return tag;
}
