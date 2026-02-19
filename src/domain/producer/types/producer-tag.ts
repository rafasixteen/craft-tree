import { producerTags } from '@/db/schema';

export type ProducerTag = typeof producerTags.$inferSelect;
