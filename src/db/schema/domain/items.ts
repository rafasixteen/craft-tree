import { pgTable, text, uuid, uniqueIndex } from 'drizzle-orm/pg-core';
import { collectionsTable } from './collections';

export const itemsTable = pgTable(
	'items',
	{
		id: uuid().defaultRandom().primaryKey(),

		name: text().notNull(),
		slug: text().notNull().unique(),

		collectionId: uuid()
			.references(() => collectionsTable.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(table) => [uniqueIndex().on(table.collectionId, table.slug)],
);
