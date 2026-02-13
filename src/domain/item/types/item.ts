import { items } from '@/db/schema';

export type Item = typeof items.$inferSelect;
