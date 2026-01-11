import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { users } from '@/db/schema';

export const collections = pgTable('collections', {
	id: uuid().defaultRandom().primaryKey(),

	name: text().notNull(),
	slug: text().notNull().unique(),

	userId: text()
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
});
