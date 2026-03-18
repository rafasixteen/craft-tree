import { inventories } from '@/db/schema';

import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const items = pgTable('items', {
	id: uuid('id').defaultRandom().primaryKey(),

	name: text('name').notNull(),

	inventoryId: uuid('inventory_id')
		.references(() => inventories.id, { onDelete: 'cascade' })
		.notNull(),
});
