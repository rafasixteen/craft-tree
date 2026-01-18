'use server';

import { foldersTable } from '@/db/schema';
import { Folder } from '@/domain/folder';
import { slugify } from '@/lib/utils';
import { nameSchema, withUniqueSlugRetry } from '@/domain/shared';
import { eq } from 'drizzle-orm';
import db from '@/db/client';

interface RenameFolderArgs
{
	folderId: string;
	newName: string;
}

export async function renameFolder({ folderId, newName }: RenameFolderArgs): Promise<Folder>
{
	const parsedName = await nameSchema.parseAsync(newName);
	const baseSlug = slugify(parsedName);

	return withUniqueSlugRetry(baseSlug, async (slug) =>
	{
		const [updated] = await db.update(foldersTable).set({ name: parsedName, slug }).where(eq(foldersTable.id, folderId)).returning();
		return updated;
	});
}
