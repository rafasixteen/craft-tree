import { Producer, ProducerInput, ProducerOutput } from '@/domain/producer';

export interface ProducerNodeData extends Record<string, unknown>
{
	producer: Producer | null;
	inputs: ProducerInput[] | null;
	outputs: ProducerOutput[] | null;
}
