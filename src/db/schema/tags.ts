import { inventoriesTable } from '@/db/schema';

import { pgTable, text, unique, uuid } from 'drizzle-orm/pg-core';

export const tagsTable = pgTable(
	'tags',
	{
		id: uuid('id').defaultRandom().primaryKey(),

		name: text('name').notNull(),

		inventoryId: uuid('inventory_id')
			.notNull()
			.references(() => inventoriesTable.id, { onDelete: 'cascade' }),
	},
	(table) => [unique('unique_inventory_tag_name').on(table.inventoryId, table.name)],
);
