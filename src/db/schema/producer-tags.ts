import { pgTable, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { producers, tags } from '@/db/schema';

export const producerTags = pgTable(
	'producer_tags',
	{
		producerId: uuid('producer_id')
			.notNull()
			.references(() => producers.id, { onDelete: 'cascade' }),

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
