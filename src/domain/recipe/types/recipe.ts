import { recipesTable } from '@/db/schema';

export type Recipe = typeof recipesTable.$inferSelect;
