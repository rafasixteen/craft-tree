'use server';

import { foldersTable } from '@/db/schema';
import { slugify } from '@/lib/utils';
import { Folder } from '@/domain/folder';
import db from '@/db/client';

interface CreateFolderArgs
{
	name: string;
	collectionId: string;
	parentFolderId: string | null;
}

export async function createFolder({ name, collectionId, parentFolderId }: CreateFolderArgs): Promise<Folder>
{
	const baseSlug = slugify(name);
	let suffix = 0;

	while (true)
	{
		const slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix}`;

		try
		{
			const [insertedFolder] = await db.insert(foldersTable).values({ name, slug, collectionId, parentFolderId }).returning();
			return insertedFolder;
		}
		catch (error: any)
		{
			if (error.cause.code === '23505')
			{
				// Unique constraint violation—retry with next suffix
				suffix++;
				continue;
			}

			throw error;
		}
	}
}
