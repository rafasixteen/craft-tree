'use server';

import { foldersTable } from '@/db/schema';
import { slugify } from '@/lib/utils';
import { Folder } from '@/domain/folder';
import { nameSchema, withUniqueSlugRetry } from '@/domain/shared';
import db from '@/db/client';

interface CreateFolderArgs
{
	name: string;
	collectionId: string;
	parentFolderId: string | null;
}

export async function createFolder({ name, collectionId, parentFolderId }: CreateFolderArgs): Promise<Folder>
{
	const parsedName = await nameSchema.parseAsync(name);
	const baseSlug = slugify(parsedName);

	return withUniqueSlugRetry(baseSlug, async (slug) =>
	{
		const [insertedFolder] = await db.insert(foldersTable).values({ name, slug, parentFolderId, collectionId }).returning();
		return insertedFolder;
	});
}
