import { pgTable, uuid, integer, text } from 'drizzle-orm/pg-core';
import { items } from '@/db/schema';

export const recipes = pgTable('recipes', {
	id: uuid().defaultRandom().primaryKey(),

	name: text().notNull(),
	slug: text().notNull().unique(),

	itemId: uuid()
		.references(() => items.id, { onDelete: 'cascade' })
		.notNull(),

	quantity: integer().notNull(),
	time: integer().notNull(),
});
