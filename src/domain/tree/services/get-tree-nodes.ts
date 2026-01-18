'use server';

import { sql } from 'drizzle-orm';
import db from '@/db/client';

interface FolderTreeRow
{
	folder_id: string;
	folder_name: string;
	folder_slug: string;

	parent_folder_id: string | null;

	item_id: string | null;
	item_name: string | null;
	item_slug: string | null;

	recipe_id: string | null;
	recipe_name: string | null;
	recipe_slug: string | null;
}

export async function getTreeNodes(collectionId: string): Promise<FolderTreeRow[]>
{
	const result = await db.execute(sql`
		WITH RECURSIVE
			folder_tree AS (
				SELECT
					f.id,
					f.name,
					f.slug,
					f.parent_folder_id,
					f.collection_id
				FROM
					folders f
				WHERE
					f.collection_id = ${collectionId}
					AND f.parent_folder_id IS NULL
				UNION ALL
				SELECT
					child.id,
					child.name,
					child.slug,
					child.parent_folder_id,
					child.collection_id
				FROM
					folders child
					JOIN folder_tree ft ON ft.id = child.parent_folder_id
			)
		-- items inside folders
		SELECT
			ft.id AS folder_id,
			ft.name AS folder_name,
			ft.slug AS folder_slug,
			ft.parent_folder_id AS parent_folder_id,
			i.id AS item_id,
			i.name AS item_name,
			i.slug AS item_slug,
			r.id AS recipe_id,
			r.name AS recipe_name,
			r.slug AS recipe_slug
		FROM
			folder_tree ft
			LEFT JOIN items i ON i.folder_id = ft.id
			LEFT JOIN recipes r ON r.item_id = i.id
		UNION ALL
		-- items with no folder
		SELECT
			NULL AS folder_id,
			NULL AS folder_name,
			NULL AS folder_slug,
			NULL AS parent_folder_id,
			i.id AS item_id,
			i.name AS item_name,
			i.slug AS item_slug,
			r.id AS recipe_id,
			r.name AS recipe_name,
			r.slug AS recipe_slug
		FROM
			items i
			LEFT JOIN recipes r ON r.item_id = i.id
		WHERE
			i.folder_id IS NULL
			AND i.collection_id = ${collectionId};
	`);

	return result.rows as unknown as FolderTreeRow[];
}
