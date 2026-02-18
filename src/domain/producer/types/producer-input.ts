import { producerInputs } from '@/db/schema';

export type ProducerInput = typeof producerInputs.$inferSelect;
