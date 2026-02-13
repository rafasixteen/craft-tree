import { producers, producerInputs, producerOutputs } from '@/db/schema';

export type ProducerInput = Omit<typeof producerInputs.$inferSelect, 'inventoryId'>;

export type ProducerOutput = Omit<typeof producerOutputs.$inferSelect, 'inventoryId'>;

export type Producer = typeof producers.$inferSelect & {
	inputs: ProducerInput[];
	outputs: ProducerOutput[];
};
