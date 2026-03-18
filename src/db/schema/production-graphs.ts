import { pgTable, text, jsonb, uuid, uniqueIndex } from 'drizzle-orm/pg-core';
import { inventories } from '@/db/schema';
import { ProductionGraphData } from '@/domain/production-graph';

export const productionGraphs = pgTable(
	'production_graphs',
	{
		id: uuid('id').defaultRandom().primaryKey().notNull(),

		name: text('name').notNull(),

		data: jsonb('data')
			.$type<ProductionGraphData>()
			.notNull()
			.default({
				nodes: [],
				edges: [],
				viewport: { x: 0, y: 0, zoom: 1 },
			}),

		inventoryId: uuid('inventory_id')
			.references(() => inventories.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(table) => [
		uniqueIndex('unique_inventory_producer_graph_name').on(
			table.inventoryId,
			table.name,
		),
	],
);
