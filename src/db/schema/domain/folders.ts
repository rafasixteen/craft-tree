import { pgTable, text, uuid, uniqueIndex, foreignKey, integer, index } from 'drizzle-orm/pg-core';
import { collectionsTable } from '@/db/schema';

export const foldersTable = pgTable(
	'folders',
	{
		id: uuid().defaultRandom().primaryKey(),

		name: text().notNull(),
		slug: text().notNull(),

		collectionId: uuid('collection_id')
			.references(() => collectionsTable.id, { onDelete: 'cascade' })
			.notNull(),

		parentFolderId: uuid('parent_folder_id'),
		order: integer().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.parentFolderId],
			foreignColumns: [table.id],
		}).onDelete('cascade'),

		uniqueIndex().on(table.collectionId, table.slug),
		index().on(table.collectionId),
		index().on(table.parentFolderId),
		index().on(table.collectionId, table.parentFolderId, table.order),
		// uniqueIndex().on(table.order, table.parentFolderId),
	],
);
