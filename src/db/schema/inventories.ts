import { pgTable, text, unique, uuid } from 'drizzle-orm/pg-core';

export const inventoriesTable = pgTable(
	'inventories',
	{
		id: uuid('id').defaultRandom().primaryKey(),

		name: text('name').notNull(),

		// Supabase auth.users.id is a uuid.
		// In the supabase SQL editor we run:
		// ALTER TABLE inventories
		// ADD CONSTRAINT inventories_user_id_fkey
		// FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
		userId: uuid('user_id').notNull(),
	},
	(table) => [unique('unique_user_inventory_name').on(table.userId, table.name)],
);
