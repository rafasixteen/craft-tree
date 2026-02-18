import { producers } from '@/db/schema';

export type Producer = typeof producers.$inferSelect;
