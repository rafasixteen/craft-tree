import { producersTable, tags } from '@/db/schema';

import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

export const producerTagsTable = pgTable(
	'producer_tags',
	{
		producerId: uuid('producer_id')
			.notNull()
			.references(() => producersTable.id, { onDelete: 'cascade' }),

		tagId: uuid('tag_id')
			.notNull()
			.references(() => tags.id, { onDelete: 'cascade' }),
	},
	(table) => [
		primaryKey({
			columns: [table.producerId, table.tagId],
		}),
	],
);
