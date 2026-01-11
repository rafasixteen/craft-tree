import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { usersTable } from '@/db/schema';

export const collectionsTable = pgTable('collections', {
	id: uuid().defaultRandom().primaryKey(),

	name: text().notNull(),
	slug: text().notNull().unique(),

	userId: text()
		.references(() => usersTable.id, { onDelete: 'cascade' })
		.notNull(),
});
