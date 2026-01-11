import { pgTable, text, uuid, uniqueIndex } from 'drizzle-orm/pg-core';
import { collections } from './collections';

export const items = pgTable(
	'items',
	{
		id: uuid().defaultRandom().primaryKey(),

		name: text().notNull(),
		slug: text().notNull().unique(),

		collectionId: uuid()
			.references(() => collections.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(table) => [uniqueIndex('unique_slug_per_collection').on(table.collectionId, table.slug)],
);
