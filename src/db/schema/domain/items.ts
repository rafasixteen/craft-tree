import { pgTable, text, uuid, uniqueIndex } from 'drizzle-orm/pg-core';
import { foldersTable } from './folders';

export const itemsTable = pgTable(
	'items',
	{
		id: uuid().defaultRandom().primaryKey(),

		name: text().notNull(),
		slug: text().notNull().unique(),

		folderId: uuid('folder_id')
			.references(() => foldersTable.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(table) => [uniqueIndex().on(table.folderId, table.slug)],
);
