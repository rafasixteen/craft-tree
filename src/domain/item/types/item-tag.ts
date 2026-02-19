import { itemTags } from '@/db/schema';

export type ItemTag = typeof itemTags.$inferSelect;
