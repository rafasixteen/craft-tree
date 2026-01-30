import { pgTable, text, uuid, uniqueIndex, foreignKey, integer } from 'drizzle-orm/pg-core';
import { isNull, isNotNull } from 'drizzle-orm';
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

		uniqueIndex().on(table.order).where(isNull(table.parentFolderId)),
		uniqueIndex().on(table.parentFolderId, table.order).where(isNotNull(table.parentFolderId)),
	],
);
