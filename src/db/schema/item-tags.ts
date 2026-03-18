import { itemsTable, tagsTable } from '@/db/schema';

import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

export const itemTagsTable = pgTable(
	'item_tags',
	{
		itemId: uuid('item_id')
			.notNull()
			.references(() => itemsTable.id, { onDelete: 'cascade' }),

		tagId: uuid('tag_id')
			.notNull()
			.references(() => tagsTable.id, { onDelete: 'cascade' }),
	},
	(table) => [
		primaryKey({
			columns: [table.itemId, table.tagId],
		}),
	],
);
