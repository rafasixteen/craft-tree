import { producers, producerInputs, producerOutputs } from '@/db/schema';

export type ProducerInput = Omit<typeof producerInputs.$inferSelect, 'id' | 'inventoryId' | 'producerId'>;

export type ProducerOutput = Omit<typeof producerOutputs.$inferSelect, 'id' | 'inventoryId' | 'producerId'>;

export type Producer = typeof producers.$inferSelect & {
	inputs: ProducerInput[];
	outputs: ProducerOutput[];
};
