import { inventories } from '@/db/schema';

import { pgTable, text, unique, uuid } from 'drizzle-orm/pg-core';

export const tags = pgTable(
	'tags',
	{
		id: uuid('id').defaultRandom().primaryKey(),

		name: text('name').notNull(),

		inventoryId: uuid('inventory_id')
			.notNull()
			.references(() => inventories.id, { onDelete: 'cascade' }),
	},
	(table) => [unique('unique_inventory_tag_name').on(table.inventoryId, table.name)],
);
