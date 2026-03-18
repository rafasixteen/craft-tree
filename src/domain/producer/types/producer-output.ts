import { producerOutputsTable } from '@/db/schema';

export type ProducerOutput = typeof producerOutputsTable.$inferSelect;
