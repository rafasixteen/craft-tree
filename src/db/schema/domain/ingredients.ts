import { pgTable, uuid, integer, index } from 'drizzle-orm/pg-core';
import { itemsTable, recipesTable } from '@/db/schema';

export const ingredientsTable = pgTable(
	'ingredients',
	{
		id: uuid().defaultRandom().primaryKey(),

		itemId: uuid('item_id')
			.references(() => itemsTable.id, { onDelete: 'cascade' })
			.notNull(),

		quantity: integer().notNull(),

		recipeId: uuid('recipe_id')
			.references(() => recipesTable.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(table) => [index().on(table.recipeId), index().on(table.itemId)],
);
