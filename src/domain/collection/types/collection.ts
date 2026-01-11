import { collectionsTable } from '@/db/schema';

export type Collection = typeof collectionsTable.$inferSelect;
