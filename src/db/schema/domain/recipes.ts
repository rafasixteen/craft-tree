import { pgTable, uuid, integer, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { itemsTable } from '@/db/schema';

export const recipesTable = pgTable(
	'recipes',
	{
		id: uuid().defaultRandom().primaryKey(),

		name: text().notNull(),
		slug: text().notNull(),

		itemId: uuid()
			.references(() => itemsTable.id, { onDelete: 'cascade' })
			.notNull(),

		quantity: integer().notNull(),
		time: integer().notNull(),
	},
	(table) => [uniqueIndex().on(table.itemId, table.slug)],
);
