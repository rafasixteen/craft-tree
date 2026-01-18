'use server';

import { foldersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

export async function deleteFolder(folderId: string)
{
	await db.delete(foldersTable).where(eq(foldersTable.id, folderId));
}
