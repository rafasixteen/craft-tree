import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { inventories } from '@/db/schema';

export const items = pgTable('items', {
	id: uuid('id').defaultRandom().primaryKey(),

	name: text('name').notNull(),

	icon: text('icon'),

	inventoryId: uuid('inventory_id')
		.references(() => inventories.id, { onDelete: 'cascade' })
		.notNull(),
});
