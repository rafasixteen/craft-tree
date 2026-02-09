import { pgTable, uuid, integer, text, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { itemsTable } from '@/db/schema';

export const recipesTable = pgTable(
	'recipes',
	{
		id: uuid().defaultRandom().primaryKey(),

		name: text().notNull(),
		slug: text().notNull(),

		itemId: uuid('item_id')
			.references(() => itemsTable.id, { onDelete: 'cascade' })
			.notNull(),

		order: integer().notNull(),

		quantity: integer().notNull(),
		time: integer().notNull(),
	},
	(table) => [
		uniqueIndex().on(table.itemId, table.slug),
		index().on(table.itemId),
		index().on(table.itemId, table.order),
		// uniqueIndex().on(table.itemId, table.order)
	],
);
