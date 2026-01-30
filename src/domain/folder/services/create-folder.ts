'use server';

import { foldersTable } from '@/db/schema';
import { slugify } from '@/lib/utils';
import { Folder } from '@/domain/folder';
import { nameSchema, withUniqueSlugRetry } from '@/domain/shared';
import { and, eq, isNull, sql } from 'drizzle-orm';
import db from '@/db/client';

interface CreateFolderArgs
{
	name: string;
	collectionId: string;
	parentFolderId: string | null;
}

export async function createFolder({ name, collectionId, parentFolderId }: CreateFolderArgs): Promise<Folder>
{
	const [parsedName, order] = await Promise.all([nameSchema.parseAsync(name), getNextFolderOrder(collectionId, parentFolderId)]);

	const baseSlug = slugify(parsedName);

	return withUniqueSlugRetry(baseSlug, async (slug) =>
	{
		const [insertedFolder] = await db.insert(foldersTable).values({ name, slug, parentFolderId, collectionId, order }).returning();
		return insertedFolder;
	});
}

async function getNextFolderOrder(collectionId: string, parentFolderId: string | null)
{
	const [row] = await db
		.select({ max: sql<number>`coalesce(max(${foldersTable.order}), 0)` })
		.from(foldersTable)
		.where(
			parentFolderId === null
				? and(eq(foldersTable.collectionId, collectionId), isNull(foldersTable.parentFolderId))
				: and(eq(foldersTable.collectionId, collectionId), eq(foldersTable.parentFolderId, parentFolderId)),
		);

	console.log(row.max);

	return row.max + 1;
}
