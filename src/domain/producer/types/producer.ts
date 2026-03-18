import { producersTable } from '@/db/schema';

export type Producer = typeof producersTable.$inferSelect;
