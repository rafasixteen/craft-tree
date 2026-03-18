import { itemsTable, producersTable } from '@/db/schema';

import { sql } from 'drizzle-orm';
import { check, integer, pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

export const producerInputsTable = pgTable(
	'producer_inputs',
	{
		id: uuid('id').defaultRandom().primaryKey().notNull(),

		quantity: integer('quantity').notNull(),

		itemId: uuid('item_id')
			.references(() => itemsTable.id, { onDelete: 'cascade' })
			.notNull(),

		producerId: uuid('producer_id')
			.references(() => producersTable.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(table) => [
		check('quantity_positive', sql`${table.quantity} > 0`),
		uniqueIndex('unique_item_per_producer_input').on(table.itemId, table.producerId),
	],
);
