import { pgTable, text, uuid, uniqueIndex } from 'drizzle-orm/pg-core';
import { foldersTable } from './folders';
import { collectionsTable } from '@/db/schema';

export const itemsTable = pgTable(
	'items',
	{
		id: uuid().defaultRandom().primaryKey(),

		name: text().notNull(),
		slug: text().notNull(),

		collectionId: uuid('collection_id')
			.references(() => collectionsTable.id, { onDelete: 'cascade' })
			.notNull(),

		folderId: uuid('folder_id').references(() => foldersTable.id, { onDelete: 'cascade' }),
	},
	(table) => [uniqueIndex().on(table.collectionId, table.slug)],
);
