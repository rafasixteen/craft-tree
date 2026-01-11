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
	(table) => [uniqueIndex('unique_slug_per_collection').on(table.collectionId, table.slug)],
);
