import { items, tags } from '@/db/schema';

import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

export const itemTags = pgTable(
	'item_tags',
	{
		itemId: uuid('item_id')
			.notNull()
			.references(() => items.id, { onDelete: 'cascade' }),

		tagId: uuid('tag_id')
			.notNull()
			.references(() => tags.id, { onDelete: 'cascade' }),
	},
	(table) => [
		primaryKey({
			columns: [table.itemId, table.tagId],
		}),
	],
);
