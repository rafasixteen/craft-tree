import { inventoriesTable } from '@/db/schema';

export type Inventory = typeof inventoriesTable.$inferSelect;
