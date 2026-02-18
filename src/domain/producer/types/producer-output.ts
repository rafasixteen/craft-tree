import { producerOutputs } from '@/db/schema';

export type ProducerOutput = typeof producerOutputs.$inferSelect;
