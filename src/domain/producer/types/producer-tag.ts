import { producerTagsTable } from '@/db/schema';

export type ProducerTag = typeof producerTagsTable.$inferSelect;
