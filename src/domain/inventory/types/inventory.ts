import { inventories } from '@/db/schema';

export type Inventory = typeof inventories.$inferSelect;
