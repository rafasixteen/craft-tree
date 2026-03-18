import { tagsTable } from '@/db/schema';

export type Tag = typeof tagsTable.$inferSelect;
