import { pgTable, text, uuid, uniqueIndex, foreignKey } from 'drizzle-orm/pg-core';
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
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [table.id],
		}).onDelete('cascade'),
		uniqueIndex('unique_slug_per_user_id').on(table.userId, table.slug),
	],
);
