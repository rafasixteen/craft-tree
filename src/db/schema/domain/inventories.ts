import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { usersTable } from '@/db/schema';

export const inventories = pgTable('inventories', {
	id: uuid('id').defaultRandom().primaryKey(),

	name: text('name').notNull(),

	userId: text('user_id')
		.references(() => usersTable.id, { onDelete: 'cascade' })
		.notNull(),
});
