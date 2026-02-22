import { Producer, ProducerInput, ProducerOutput } from '@/domain/producer';
import { ItemRate } from '@/domain/production-graph';

export interface ProducerNodeData extends Record<string, unknown>
{
	producer: Producer | null;
	inputs: ProducerInput[] | null;
	outputs: ProducerOutput[] | null;
	outputRates: ItemRate[] | null;
}
