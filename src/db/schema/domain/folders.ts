import { pgTable, text, uuid, uniqueIndex, foreignKey } from 'drizzle-orm/pg-core';
import { collections } from '@/db/schema';

export const folders = pgTable(
	'folders',
	{
		id: uuid().defaultRandom().primaryKey(),

		name: text().notNull(),
		slug: text().notNull().unique(),

		parentFolderId: uuid('parent_folder_id'),

		collectionId: uuid()
			.references(() => collections.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.parentFolderId],
			foreignColumns: [table.id],
		}).onDelete('cascade'),
		uniqueIndex('unique_slug_per_collection_folder').on(table.collectionId, table.slug),
	],
);
