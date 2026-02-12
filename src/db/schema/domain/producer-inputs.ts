import { check, integer, pgTable, uuid } from 'drizzle-orm/pg-core';
import { producers, items } from '@/db/schema';
import { sql } from 'drizzle-orm';

export const producerInputs = pgTable(
	'producer_inputs',
	{
		id: uuid('id').defaultRandom().primaryKey().notNull(),

		quantity: integer('quantity').notNull(),

		itemId: uuid('item_id')
			.references(() => items.id, { onDelete: 'cascade' })
			.notNull(),

		producerId: uuid('producer_id')
			.references(() => producers.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(table) => [
		check('quantity_positive', sql`${table.quantity} > 0`),
	],
);
