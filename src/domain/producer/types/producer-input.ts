import { producerInputsTable } from '@/db/schema';

export type ProducerInput = typeof producerInputsTable.$inferSelect;
