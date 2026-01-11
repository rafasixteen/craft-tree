import { pgTable, uuid, integer, text } from 'drizzle-orm/pg-core';
import { itemsTable } from '@/db/schema';

export const recipesTable = pgTable('recipes', {
	id: uuid().defaultRandom().primaryKey(),

	name: text().notNull(),
	slug: text().notNull().unique(),

	itemId: uuid()
		.references(() => itemsTable.id, { onDelete: 'cascade' })
		.notNull(),

	quantity: integer().notNull(),
	time: integer().notNull(),
});
