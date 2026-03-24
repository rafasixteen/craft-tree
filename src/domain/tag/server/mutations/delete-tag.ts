'use server';

import db from '@/db/client';
import { tagsTable } from '@/db/schema';

import { Tag } from '@/domain/tag';

import { eq } from 'drizzle-orm';

interface DeleteTagInput
{
	tagId: Tag['id'];
}

export async function deleteTag({ tagId }: DeleteTagInput): Promise<void>
{
	await db.delete(tagsTable).where(eq(tagsTable.id, tagId));
}
