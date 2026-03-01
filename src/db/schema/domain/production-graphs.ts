import { pgTable, text, jsonb, uuid, uniqueIndex } from 'drizzle-orm/pg-core';
import { inventories } from '@/db/schema';

export const productionGraphs = pgTable(
	'production_graphs',
	{
		id: uuid('id').defaultRandom().primaryKey().notNull(),

		name: text('name').notNull(),

		data: jsonb('data').notNull(),

		inventoryId: uuid('inventory_id')
			.references(() => inventories.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(table) => [
		uniqueIndex('unique_inventory_producer_graph_name').on(table.inventoryId, table.name),
	],
);
