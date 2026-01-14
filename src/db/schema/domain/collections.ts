import { pgTable, text, uuid, uniqueIndex } from 'drizzle-orm/pg-core';
import { usersTable } from '@/db/schema';

export const collectionsTable = pgTable(
	'collections',
	{
		id: uuid().defaultRandom().primaryKey(),

		name: text().notNull(),
		slug: text().notNull(),

		userId: text()
			.references(() => usersTable.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(table) => [uniqueIndex().on(table.userId, table.slug)],
);
