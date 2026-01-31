import { pgTable, text, uuid, uniqueIndex, integer } from 'drizzle-orm/pg-core';
import { collectionsTable, foldersTable } from '@/db/schema';

export const itemsTable = pgTable(
	'items',
	{
		id: uuid().defaultRandom().primaryKey(),

		name: text().notNull(),
		slug: text().notNull(),

		collectionId: uuid('collection_id')
			.references(() => collectionsTable.id, { onDelete: 'cascade' })
			.notNull(),

		folderId: uuid('folder_id').references(() => foldersTable.id, {
			onDelete: 'cascade',
		}),

		order: integer().notNull(),
	},
	(table) => [
		uniqueIndex().on(table.collectionId, table.slug),
		// uniqueIndex().on(table.folderId, table.order)
	],
);
