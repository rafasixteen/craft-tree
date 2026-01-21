import { ingredientsTable } from '@/db/schema';

export type Ingredient = typeof ingredientsTable.$inferSelect;
