import { pgTable, text, unique, uuid } from 'drizzle-orm/pg-core';
import { usersTable } from '@/db/schema';

export const inventories = pgTable(
	'inventories',
	{
		id: uuid('id').defaultRandom().primaryKey(),

		name: text('name').notNull(),

		userId: text('user_id')
			.references(() => usersTable.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(table) => [
		unique('unique_user_inventory_name').on(table.userId, table.name),
	],
);
