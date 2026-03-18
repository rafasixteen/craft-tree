import { itemsTable } from '@/db/schema';

export type Item = typeof itemsTable.$inferSelect;
