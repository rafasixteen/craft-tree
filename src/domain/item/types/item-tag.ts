import { itemTagsTable } from '@/db/schema';

export type ItemTag = typeof itemTagsTable.$inferSelect;
