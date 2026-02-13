import { tags } from '@/db/schema';

export type Tag = typeof tags.$inferSelect;
