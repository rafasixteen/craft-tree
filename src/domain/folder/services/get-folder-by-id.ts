'use server';

import { foldersTable } from '@/db/schema';
import { Folder } from '@/domain/folder';
import db from '@/db/client';
import { eq } from 'drizzle-orm';

export async function getFolderById(id: string): Promise<Folder | null>
{
	const existingFolder = await db
		.select()
		.from(foldersTable)
		.where(eq(foldersTable.id, id))
		.limit(1)
		.then((rows) => rows[0] || null);

	return existingFolder;
}
