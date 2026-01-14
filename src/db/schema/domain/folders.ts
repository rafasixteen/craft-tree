import { pgTable, text, uuid, uniqueIndex, foreignKey } from 'drizzle-orm/pg-core';
import { collectionsTable } from '@/db/schema';

export const foldersTable = pgTable(
	'folders',
	{
		id: uuid().defaultRandom().primaryKey(),

		name: text().notNull(),
		slug: text().notNull(),

		parentFolderId: uuid('parent_folder_id'),

		collectionId: uuid()
			.references(() => collectionsTable.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.parentFolderId],
			foreignColumns: [table.id],
		}).onDelete('cascade'),
		uniqueIndex('unique_slug_per_collection_folder').on(table.collectionId, table.slug),
	],
);
