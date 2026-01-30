import { pgTable, text, uuid, uniqueIndex, integer } from 'drizzle-orm/pg-core';
import { isNull, isNotNull } from 'drizzle-orm';
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

		uniqueIndex().on(table.order).where(isNull(table.folderId)),
		uniqueIndex().on(table.folderId, table.order).where(isNotNull(table.folderId)),
	],
);
