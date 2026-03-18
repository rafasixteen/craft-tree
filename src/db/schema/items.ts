import { inventoriesTable } from '@/db/schema';

import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const itemsTable = pgTable('items', {
	id: uuid('id').defaultRandom().primaryKey(),

	name: text('name').notNull(),

	inventoryId: uuid('inventory_id')
		.references(() => inventoriesTable.id, { onDelete: 'cascade' })
		.notNull(),
});
