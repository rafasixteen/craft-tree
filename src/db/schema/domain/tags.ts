import { pgTable, text, unique, uuid } from 'drizzle-orm/pg-core';
import { inventories } from '@/db/schema';

export const tags = pgTable(
	'tags',
	{
		id: uuid('id').defaultRandom().primaryKey(),

		name: text('name').notNull(),

		inventoryId: uuid('inventory_id')
			.notNull()
			.references(() => inventories.id, { onDelete: 'cascade' }),
	},
	(table) => [unique().on(table.inventoryId, table.name)],
);
