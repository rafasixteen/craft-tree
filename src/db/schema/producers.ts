import { check, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { inventories } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { unique } from 'drizzle-orm/pg-core';

export const producers = pgTable(
	'producers',
	{
		id: uuid('id').defaultRandom().primaryKey().notNull(),

		name: text('name').notNull(),

		time: integer('time').notNull(),

		inventoryId: uuid('inventory_id')
			.references(() => inventories.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(table) => [
		check('time_positive', sql`${table.time} > 0`),
		unique('unique_inventory_producer_name').on(table.inventoryId, table.name),
	],
);
