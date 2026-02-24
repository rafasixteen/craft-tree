import { Producer, ProducerInput, ProducerOutput } from '@/domain/producer';
import { ItemRate } from '@/domain/production-graph';

export interface ProducerNodeData extends Record<string, unknown>
{
	producer: Producer | null;
	inputs: ProducerInput[] | null;
	outputs: ProducerOutput[] | null;

	producerCount: number;
	inputRates: ItemRate[] | null;
	outputRates: ItemRate[] | null;
}
