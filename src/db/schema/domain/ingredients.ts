import { pgTable, uuid, integer } from 'drizzle-orm/pg-core';
import { items, recipes } from '@/db/schema';

export const ingredients = pgTable('ingredients', {
	id: uuid().defaultRandom().primaryKey(),

	itemId: uuid()
		.references(() => items.id, { onDelete: 'cascade' })
		.notNull(),

	quantity: integer().notNull(),

	recipeId: uuid()
		.references(() => recipes.id, { onDelete: 'cascade' })
		.notNull(),
});
